// src/services/tts/polly.js
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import alawmulaw from "alawmulaw";

const CHUNK_SIZE = 100; // Standard size for audio chunks in bytes

export class PollyTTSService {
  constructor(config) {
    this.polly = new PollyClient({
      region: config.aws.region,
    });
    this.config = config;
  }

  async* generateAudioChunks(audioBuffer) {
    // Correct conversion from Node.js Buffer to Int16Array
    const pcmSamples = new Int16Array(
      audioBuffer.buffer,
      audioBuffer.byteOffset,
      audioBuffer.byteLength / 2
    );

    for (let offset = 0; offset < pcmSamples.length; offset += CHUNK_SIZE) {
      const chunk = pcmSamples.slice(offset, offset + CHUNK_SIZE);
      const muLawChunk = alawmulaw.mulaw.encode(chunk);
      yield Buffer.from(muLawChunk).toString("base64");
    }
  }

  async synthesize(text, callId) {
    const command = new SynthesizeSpeechCommand({
      Engine: "neural", // Verify that your voice supports this engine, or try "neural"/"standard"
      OutputFormat: "pcm",
      SampleRate: String(this.config.audio.sampleRate),
      Text: `<speak>${text}</speak>`,
      TextType: "ssml",
      VoiceId: this.config.tts.voiceId,
    });

    try {
      const response = await this.polly.send(command);
      if (!response.AudioStream) {
        throw new Error("Invalid Polly response: No AudioStream received");
      }
      // Convert the Readable stream to a Buffer
      const chunks = [];
      for await (const chunk of response.AudioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error("Invalid Polly response: Empty AudioStream");
      }
      return this.generateAudioChunks(audioBuffer);
    } catch (error) {
      console.error("Polly TTS error:", error);
      throw error;
    }
  }

  // Properly clean up resources to prevent memory leaks
  cleanup() {
    try {
      if (this.polly) {
        // Destroy any open connections or pending requests
        this.polly.destroy();
        this.polly = null;
      }
    } catch (error) {
      console.error('Error during Polly TTS cleanup:', error);
    }
  }
}