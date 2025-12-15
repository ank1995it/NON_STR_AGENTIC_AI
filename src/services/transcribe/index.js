import { TranscribeClient } from './client.js';

export class TranscribeService {
    constructor(config , callId, logger) {
            this.config = config;
            this.callId = callId;
            this.client = null;
            this.logger = logger.child({service: 'TranscribeService' })
    }

    async startStream(audioStream , sttData) {
        try {
            this.logger.info("startStream service started")
            if (!audioStream) {
                throw new Error('Audio stream not provided');
            }

            if (this.client) {
                await this.stopStream();
            }

            this.client = new TranscribeClient(this.config,this.logger);
            return await this.client.startStream(audioStream,sttData);
        } catch (error) {
            this.logger.error(error,'Failed to start transcription:');
            throw error;
        }
    }

    async stopStream() {
        try {
            this.logger.info("stopStream service initiated")
            if (this.client) {
                await this.client.cleanup();
                this.client = null;
            }
        } catch (error) {
            this.logger.error(error,'Error stopping transcription');
            throw error;
        }
    }
}