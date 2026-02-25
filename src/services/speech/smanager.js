// src/services/speech/smanager.js
import { EventEmitter } from 'events';

export class SpeechManager extends EventEmitter {
    constructor(config, logger) {
        super();
        this.config = config;
        this.logger = logger.child({service: 'SpeechManager'})
        this.state = {
            callSid:null,
            streamSid: null,
            isStreamStarted: false,
            turnCounter: 0,
            transcript: {
                partial: '',
                final: '',
                timer: null,
                waitTime: 1000, // 1.5 seconds
                lastTranscriptTime: null
            },
            tts: {
                isSpeaking: false,
                isInterrupted: false,
                lastResponseTime: Date.now(),
                minResponseInterval: 1000
            }
        };
        this.logger.info('SpeechManager initialized');
    }

    getTimestamp() {
        return new Date().toISOString().split('T')[1].slice(0, -1);
    }

    setStreamSidAndcallSid(streamSid,callSid) {
        this.state.streamSid = streamSid;
        this.state.callSid = callSid;
        this.state.isStreamStarted = true;
        console.log(`[${this.getTimestamp()}] Stream started with SID: ${streamSid}`);
    }

    isStreaming() {
        return this.state.isStreamStarted;
    }

    isSpeaking() {
        return this.state.tts.isSpeaking;
    }

    handleTranscript(transcript, isPartial) {
        if (!this.state.isStreamStarted) return;

        const trimmedTranscript = transcript?.trim();
        if (!trimmedTranscript) return;

        // if (this.state.tts.isSpeaking) {
        //     this.stopTTS();
        // }

        if (isPartial) {
            this.handlePartialTranscript(trimmedTranscript);
        } else {
            this.handleFinalTranscript(trimmedTranscript);
        }
    }

    handlePartialTranscript(transcript) {
        this.state.transcript.partial = transcript;
        console.log(`[${this.getTimestamp()}] Partial transcript: "${transcript}"`);

        // Reset timer for partial results
        this.resetTranscriptTimer();
    }

    handleFinalTranscript(transcript) {
        this.state.transcript.final = transcript;
        this.state.transcript.lastTranscriptTime = Date.now();
        console.log(`[${this.getTimestamp()}] Final transcript: "${transcript}"`);

        //this.resetTranscriptTimer();
        // Process final transcript immediately
        this.processAccumulatedTranscript(transcript);
    }

    resetTranscriptTimer() {
        if (this.state.transcript.timer) {
            clearTimeout(this.state.transcript.timer);
        }

        this.state.transcript.timer = setTimeout(() => {
            const timeWaited = (Date.now() - this.state.transcript.lastTranscriptTime) / 1000;
            console.log(`[${this.getTimestamp()}] Timer completed after ${timeWaited.toFixed(1)} seconds`);

            // Only process partial if we don't have a final transcript

            this.processAccumulatedTranscript(this.state.transcript.final);

        }, this.state.transcript.waitTime);
    }

    async processAccumulatedTranscript(transcript) {
        if (!transcript) return;

        try {
            console.log(`[${this.getTimestamp()}] Processing transcript: "${transcript}"`);

            this.emit('processingTranscript', transcript);

            // Clear transcript state
            this.state.transcript.partial = '';
            this.state.transcript.final = '';
            this.state.transcript.timer = null;
            this.state.transcript.lastTranscriptTime = null;

        } catch (error) {
            console.error(`[${this.getTimestamp()}] Error processing transcript:`, error);
            this.logger.error(error, 'Error processing transcript:');
        }
    }

    startTTS() {
        this.state.tts.isSpeaking = true;
        this.state.tts.lastResponseTime = Date.now();
        console.log(`[${this.getTimestamp()}] TTS started`);
        this.emit('ttsStarted');
    }

    stopTTS(interrupted = false) {
        if (this.state.tts.isSpeaking) {
            this.state.tts.isSpeaking = false;
            this.state.tts.isInterrupted = interrupted;
            this.logger.info({ interrupted }, 'TTS stopped');
            this.emit('ttsStopped', interrupted);
        }
    }

    cleanup() {
        if (this.state.transcript.timer) {
            clearTimeout(this.state.transcript.timer);
        }
        this.state.transcript.partial = '';
        this.state.transcript.final = '';
        this.state.tts.isSpeaking = false;
        this.state.isStreamStarted = false;
        this.state.streamSid = null;
        console.log(`[${this.getTimestamp()}] Speech manager cleaned up`);
    }
}
