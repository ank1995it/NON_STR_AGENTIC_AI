// src/services/speech/WebSocketHandler.js
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { SilenceDetector } from "../silence/silence-detector.js";
import { config } from "../../config/index.js";
import { TwiMLTTSService } from "../tts/twiml.js";
//import {TwilioAudioStreamer} from './audio-streamer.js'
import { TwilioAudioStreamer } from "../background/index.js";
import AsyncLock from "async-lock";
import { performance } from "node:perf_hooks";
import { CallStreamManager } from "../grpc/grpc-client.js";
import { CallEventPublisher } from "../snsEvents/callEventPublisher.js";
export class WebSocketHandler {
  constructor(socket, speechManager, services, callId, llmUrl, logger) {
    this.llmUrl = llmUrl;
    this.callId = callId;
    this.logger = logger.child({ service: "WebSocketHandler" });
    this.socket = socket;
    this.speechManager = speechManager;
    this.services = services;
    this.setupEventHandlers();
    this.lastResponseStartTime = null;
    this.isInterrupted = false;
    this.isTTSInterrupted = false;
    this.isSendInterruption = false; // added on 19-3-25
    this.isAgentRecorderInterrupted = false;
    this.fetchRedisData = false;
    this.ttsSilenceEmitted = false;
    this.isRecognizing = false;
    this.isMethodCalledOnce = false; // Track if audio streaming is active
    this.isTTSLock = false; // Track if TTS is locked
    this.isSpeechStartDetected = false;
    this.speechStartTime = 0;
    this.speechProcessTime = 0;
    this.callStreamManager = new CallStreamManager(this.callId, this.logger);
    this.audioStreamer = null; //due to distortioncommented on 27-03-25
    this.bgsound = true;
    this.callStartedEventSent = false;
    this.callConnectedEventSent = false;
    this.callEndedEventSent = false;
    this.lastUserUtterance = null;
    this.postCallEventSent = false;

    this.eventPublisher = new CallEventPublisher(callId, this.logger);
    // Mark and Clear event handling properties
    this.markQueue = [];

    this.silenceDetector = new SilenceDetector(speechManager, config);

    this.lock = new AsyncLock(); // lock object created for async operations

    this.silenceDetector.on("silenceWarning", async (message) => {
      await this.handleTranscriptProcessing(""); // added on 29-03-25
      if (!this.speechManager.isSpeaking()) {
        this.fetchRedisData = true;
        this.ttsSilenceEmitted = true;
        // await this.generateAndStreamTTS(message);
      }
    });

    this.silenceDetector.on("welcomeMsg", async (message) => {
      this.logger.info(
        "===================Initiating Conversation========================="
      );
      if (!this.speechManager.isSpeaking()) {
        //await this.generateAndStreamTTS(message);
        await this.handleTranscriptProcessing(message);
      }
    });

    this.silenceDetector.on("disconnectCall", () => {
      new TwiMLTTSService(config).disconnectCall(this.callId);
      this.handleStop();
    });

    this.logger.info("WebSocketHandler initialized");
  }

  getTimestamp() {
    return new Date().toISOString().split("T")[1].slice(0, -1);
  }

  setupEventHandlers() {
    this.logger.info(
      `[${this.getTimestamp()}] Setting up WebSocket event handlers`
    );
    this.socket.on("message", async (rawData) => {
      try {
        let data;
        if (Buffer.isBuffer(rawData)) {
          data = rawData.toString("utf8");
        } else if (typeof rawData === "string") {
          data = rawData;
        } else if (rawData instanceof Uint8Array) {
          data = Buffer.from(rawData).toString("utf8");
        } else {
          throw new Error("Unsupported data format");
        }

        const msg = JSON.parse(data);
        await this.handleMessage(msg);
      } catch (error) {
        this.logger.error("Error processing WebSocket message:", {
          error: error.message,
          dataType: typeof rawData,
          isBuffer: Buffer.isBuffer(rawData),
        });
      }
    });

    this.socket.on("close", () => this.handleClose());
    this.socket.on("error", (error) => this.handleError(error));

    this.speechManager.on("processingTranscript", async (transcript) => {
      await this.handleTranscriptProcessing(transcript);
    });

    this.speechManager.on("ttsStopped", () => {
      this.sendStopTTS();
    });
  }

  async handleMessage(msg) {
    try {
      switch (msg.event) {
        case "start":
          await this.handleStart(msg);
          break;
        case "media":
          await this.handleMedia(msg);
          break;
        case "stop":
          await this.handleStop();
          break;
        case "mark":
          this.handleMarkEvent(msg);
          break;
        default:
          this.logger.error({ error: msg.event }, `Unknown message event:`);
      }
    } catch (error) {
      console.error(`[${this.getTimestamp()}] Message handling error:`, error);
      this.logger.error(
        {
          error: error.message,
          event: msg?.event,
        },
        "Message handling error:"
      );
    }
  }

  async handleStart(msg) {
    try {
      this.logger.info(JSON.stringify(msg));
      const { streamSid } = msg.start;
      const callSid = this.callId;
      this.speechManager.setStreamSidAndcallSid(streamSid, callSid);

      if (!this.callConnectedEventSent) {
        this.eventPublisher.publishCallEvent("CALL_CONNECTED");

        this.callConnectedEventSent = true;
      }

      this.audioStreamer = new TwilioAudioStreamer(
        this.markQueue,
        this.socket,
        streamSid
      ); //due to distortioncommented on 27-03-25

      this.markQueue = [];

      // Start recording
      //this.services.audioRecorder.startRecording(callSid);

      this.silenceDetector.initializeDetector(); // starts silence detector
      const sttJson = JSON.parse(
        Buffer.from(msg.start.customParameters.sttData, "base64").toString(
          "utf-8"
        )
      );
      this.logger.info({ msg: sttJson.locale }, "STT Data decoded");
      this.logger.info(Object.keys(this.services));

      const audioStream = this.services.audioTransformer.createReadableStream();
      //starting grpc stream here
      const recognizer = await this.services.transcribeService.startStream(
        audioStream,
        sttJson
      );

      // Event handler for when a new speech segment is detected
      let speechDetectedLogged = false;
      recognizer.speechStartDetected = (_, event) => {
        this.logger.info({
          msg: `SPEECH START DETECTED`,
          callSid,
        });
      };

      // Event handler for when a speech segment has ended
      recognizer.speechEndDetected = (_, event) => {
        this.logger.info({ msg: JSON.stringify(event) });
      };

      // Set up Azure recognition events
      recognizer.recognized = async (_, event) => {
        //console.log(event.result.reason);
        //console.log(sdk.ResultReason.RecognizedSpeech);
        const endTime = performance.now();
        if (event.result.reason == sdk.ResultReason.RecognizedSpeech) {
          const endToEndLatency = endTime - this.speechStartTime;
          const processLatency = endTime - this.speechProcessTime;
          if (speechDetectedLogged) {
            //  this.logger.info({callId: this.callId},{
            //   msg: `SPEECH LENGTH MS: ${endToEndLatency.toFixed(2)}`,callSid});
            this.logger.info({
              msg: `SPEECH PROCESS [LATENCY], DURATION MS: ${processLatency.toFixed(
                2
              )}`,
              callSid,
            });
          }
          speechDetectedLogged = false;

          const text = event.result.text;
          if (true) {
            this.isRecognizing = false; // added on 29-03-25
            if (text && text.trim().length > 0) {
              this.lastUserUtterance = text;

              await this.eventPublisher.publishTranscript("USER_SPOKE", text, {
                confidence: event.result.confidence,
                locale: event.result.language,
                speaker: "user",
              });
            }
            this.speechManager.handleTranscript(text, false);
            this.isMethodCalledOnce = false; // Reset method call tracker
            this.bgsound = true;
          }
        }
      };

      recognizer.recognizing = (_, event) => {
        this.logger.i;
        this.isRecognizing = true; // added on 29-03-25
        this.ttsSilenceEmitted = false;
        this.fetchRedisData = false;
        this.silenceDetector.handleActivity(); // reset silence detector
        const text = event.result.text;

        if (speechDetectedLogged === false) {
          this.speechStartTime = performance.now();
          speechDetectedLogged = true;
        }
        this.speechProcessTime = performance.now();

        // Handle speech detection when TTS is playing
        if (
          this.speechManager.isSpeaking() &&
          text.trim().length > 5 &&
          !this.isMethodCalledOnce
        ) {
          this.isSendInterruption = true; //added on 19-03-25
          this.isMethodCalledOnce = true; // Ensure this is called only once per recognition
          queueMicrotask(() => {
            this.handleSpeechDetected();
          }); // Yield to allow TTS state to update
        }
        //this.isTTSInterrupted = true;
        this.logger.info({
          msg: "Partial transcription",
          callSid,
          text,
        });
        // this.logger.error({callId: this.callId},this.isRecognizing);
        if (this.bgsound) {
          this.audioStreamer.start();
          this.logger.info("Background Audio Streamer Started");
          this.bgsound = false;
        }
      };

      recognizer.canceled = (_, event) => {
        this.logger.error({
          msg: "Recognition canceled",
          callSid,
          reason: event.reason,
          errorDetails: event.errorDetails,
        });

        if (event.reason === sdk.CancellationReason.Error) {
          this.handleError(new Error(event.errorDetails));
        }
      };

      recognizer.sessionStopped = () => {
        this.logger.info({
          msg: "Recognition session stopped",
          callSid,
        });
        this.cleanup();
      };
    } catch (error) {
      this.logger.error(error, "Error in handleStart:");
      this.handleError(error);
    }
  }

  async handleTranscriptProcessing(transcript) {
    try {
      if (this.speechManager.isSpeaking() && transcript.length <= 5) {
        this.logger.info("Skipping response generation - TTS in progress");
        return;
      }

      this.logger.info({ transcript }, "Generating agent response");
      const llmResponse = await this.services.responseService.generateResponse(
        transcript,
        this.speechManager.state.callSid,
        this.isSendInterruption,
        transcript === "" ? true : false,
        this.llmUrl
      );
      const response = llmResponse?.assistant;
      const cutCallStatus = llmResponse?.cut_call;

      this.audioStreamer.stop(); //stop background noise
      this.logger.info("Background Audio Streamer Stopping");
      this.isSendInterruption = false;
      if (response) {
        if (!this.ttsSilenceEmitted) {
          this.silenceDetector.handleActivity(); // reset silence detector
        }
        await this.generateAndStreamTTS(response);
      }

      if (cutCallStatus) {
        new TwiMLTTSService(config).disconnectCall(this.callId);
        this.handleStop();
      }
    } catch (error) {
      this.logger.error(error, "Response processing error");
      this.speechManager.stopTTS();
    }
  }

  async triggerPostCallSummary() {
    try {
      const url = new URL("http://localhost:17000/call_summary");
      url.searchParams.append("callid", this.callId);
      this.logger.info({ url }, "url for post call");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      return;

      // const data = await response.json();
      // this.logger.info({ data }, "data for post call");

      // await this.eventPublisher.publishPostCallSummary(data);
    } catch (error) {
      this.logger.error(error, "Post call summary error");
    }
  }

  async generateAndStreamTTS(response) {
    try {
      this.logger.info({ response }, "Starting TTS generation");
      const ttsPayload =
        typeof response === "string"
          ? JSON.stringify({ assistant: response })
          : JSON.stringify(response);
      console.log("tts payload", ttsPayload);
      this.logger.info({ ttsPayload }, ttsPayload);
      await this.eventPublisher.publishTranscript("AIAGENT_SPOKE", ttsPayload, {
        interrupted: this.isSendInterruption,
        basedOn: this.lastUserUtterance,
        speaker: "ai_agent",
      });
      this.speechManager.startTTS();
      this.isTTSInterrupted = false;
      this.markQueue = [];

      if (this.isTTSLock) {
        this.isTTSInterrupted = true;
      }
      this.socket.send(
        JSON.stringify({
          event: "clear",
          streamSid: this.speechManager.state.streamSid,
        })
      );
      await this.lock.acquire(this.callId, async () => {
        this.isTTSLock = true; // Lock TTS
        const audioGenerator = await this.services.ttsService.synthesize(
          ttsPayload,
          this.callId
        );

        for await (const chunk of audioGenerator) {
          // Check for interruption
          if (this.isTTSInterrupted) {
            this.logger.info("TTS interrupted, stopping audio stream");
            break;
          }

          // Record agent (TTS) audio
          this.isAgentRecorderInterrupted = true;
          //this.services.audioRecorder.writeAgentAudio(Buffer.from(chunk, 'base64'));

          if (chunk) {
            this.sendAudioChunk(chunk);
            // Send mark after each chunk to track progress
            this.sendMark();
            await new Promise((resolve) => setTimeout(resolve, 15));
          }
        }
        this.isTTSLock = false; // Release TTS lock
      });
      this.socket.send(
        JSON.stringify({
          event: "mark",
          streamSid: this.speechManager.state.streamSid,
          mark: { name: "endMark" },
        })
      );
      this.lastResponseStartTime = null;
    } catch (error) {
      this.logger.error(error, "Error in TTS generation");
      this.speechManager.stopTTS();
      this.isTTSInterrupted = false;
      this.isAgentRecorderInterrupted = false;
    } finally {
      //this.speechManager.stopTTS();  we will stop TTS when we will receive event form twilio
      this.isTTSInterrupted = false;
      this.isAgentRecorderInterrupted = false;
      if (!this.ttsSilenceEmitted) {
        this.silenceDetector.handleActivity(); // reset silence detector
      }
    }
  }

  sendAudioChunk(audioChunk) {
    //const EXPECTED_CHUNK_SIZE = 130; // Standard chunk size for 20ms of audio at 8kHz

    // if (Buffer.from(audioChunk, 'base64').length !== EXPECTED_CHUNK_SIZE) {
    //     this.logger.warn('Unexpected chunk size:', Buffer.from(audioChunk, 'base64').length);
    // }

    const messageToSend = {
      event: "media",
      streamSid: this.speechManager.state.streamSid,
      media: { payload: audioChunk },
    };
    this.socket.send(JSON.stringify(messageToSend));
  }

  sendAudioResponse(audioResponse) {
    const messageToSend = {
      event: "media",
      streamSid: this.speechManager.state.streamSid,
      media: { payload: audioResponse },
    };
    this.socket.send(JSON.stringify(messageToSend));
  }

  sendStopTTS() {
    console.log(`[${this.getTimestamp()}] Sending stop TTS signal`);
    this.socket.send(
      JSON.stringify({
        event: "stop_tts",
        streamSid: this.speechManager.state.streamSid,
      })
    );
  }

  // Send mark message to track TTS progress
  sendMark() {
    if (this.speechManager.state.streamSid) {
      const markEvent = {
        event: "mark",
        streamSid: this.speechManager.state.streamSid,
        mark: { name: "responsePart" },
      };
      this.socket.send(JSON.stringify(markEvent));
      this.markQueue.push("responsePart");

      this.logger.debug({
        msg: "Sent mark event",
        mark: "responsePart",
        queueLength: this.markQueue.length,
      });
    }
  }

  // Handle mark events received from Twilio
  handleMarkEvent(msg) {
    if (this.markQueue.length > 0) {
      this.markQueue.shift();
    }
    if (msg.mark?.name === "endMark") {
      this.speechManager.stopTTS(); // Stop TTS if mark is received
      this.logger.info({
        msg: "Processed mark event",
        markName: msg.mark?.name,
        remainingMarks: this.markQueue.length,
      });
      this.audioStreamer.stop(); //stop background noise
      this.logger.info("Background Audio Streamer Stopping");
    }
  }

  // Send clear event when speech is detected during TTS
  handleSpeechDetected() {
    this.logger.info({
      msg: "Speech detected during TTS",
    });

    // Interrupt the TTS
    this.isTTSInterrupted = true;
    this.speechManager.stopTTS();

    // Send clear event to indicate interruption
    this.socket.send(
      JSON.stringify({
        event: "clear",
        streamSid: this.speechManager.state.streamSid,
      })
    );

    // Reset tracking
    this.markQueue = [];

    this.logger.info({
      msg: "Sent clear event due to speech detection",
    });
  }

  async handleMedia(msg) {
    // if (!this.speechManager.isStreaming()) {
    //     console.warn(`[${this.getTimestamp()}] Received media before stream start`);
    //     //return;
    // }

    // Record caller audio

    if (msg.media?.payload && !this.isAgentRecorderInterrupted) {
      //this.services.audioRecorder.writeCallerAudio(Buffer.from(msg.media.payload, 'base64'));
    }
    this.callStreamManager.sendAudioChunk(msg?.media?.payload);
    this.services.audioTransformer.write(JSON.stringify(msg));
  }

  async createSilentBuffer(options = {}) {
    const {
      durationMs = 500, // 500ms of silence by default
      sampleRate = 8000, // 16kHz (Azure STT preferred rate)
      channels = 1, // Mono (Azure STT preferred)
      bitDepth = 16, // 16-bit (Azure STT preferred)
    } = options;

    // Calculate buffer size
    const bytesPerSample = bitDepth / 8;
    const numSamples = Math.floor((sampleRate * durationMs) / 1000);
    const bufferSize = numSamples * bytesPerSample * channels;

    console.log(`Creating silent buffer: ${durationMs}ms, ${bufferSize} bytes`);

    // Create buffer filled with zeros (silence)
    // Using Buffer.alloc ensures the buffer is initialized with zeros
    return Buffer.alloc(bufferSize, 0);
  }

  async handleStop() {
    console.log(`[${this.getTimestamp()}] Handling stop event`);
    queueMicrotask(() => {
      this.triggerPostCallSummary();
    });
    // Stop recording before cleanup
    //await this.services.audioRecorder.stopRecording();
    await this.cleanup();

    // Close WebSocket connection
    if (this.socket.readyState === 1) {
      // Check if connection is open
      this.socket.close();
    }
  }

  async handleClose() {
    console.log(`[${this.getTimestamp()}] WebSocket connection closed`);
    await this.cleanup();
  }

  async handleError(error) {
    console.error(`[${this.getTimestamp()}] WebSocket error:`, error);
    await this.cleanup();
  }

  async cleanup() {
    // Close Event Hub client if call is ending
    if (this.callEnding && this.eventHubClient) {
      await this.eventHubClient.close();
    }

    this.callStreamManager.close();
    this.audioStreamer = null; //due to distortioncommented on 27-03-25
    this.silenceDetector.cleanup();
    await this.services.transcribeService.stopStream();
    this.speechManager.cleanup();
    // await this.publishPostCallEvent();
    await this.services.cleanup?.();
  }

  async publishPostCallEvent() {
    await this.eventPublisher.publishPostCallSummary({
      durationSec: "To be calculated: 900 sec",
      direction: "inbound",
      summary: "Customer requested order cancellation",
      sentiment: "neutral",
      intent: "order_cancellation",
      recordingUrl: "https://storage.blob.core.windows.net/recordings/1234.wav",
    });
  }
}
