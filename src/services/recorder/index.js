// src/services/recorder/index.js
import { Worker } from 'worker_threads';
import { logger } from '../../utils/logger.js';

export class AudioRecorderService {
    constructor(config) {
        try {
            this.config = config;
            this.isInitialized = false;
            this.worker = new Worker(new URL('./worker.js', import.meta.url), {
                type: 'module'
            });
            
            this.setupWorkerHandlers();
            this.worker.postMessage({ type: 'init', config: this.config });
            logger.info('Worker created and init message sent');
        } catch (error) {
            logger.error('Error creating worker:', error);
            throw error;
        }
    }

    setupWorkerHandlers() {
        this.worker.on('message', (message) => {
            switch (message.type) {
                case 'initialized':
                    this.isInitialized = true;
                    logger.info('Recording worker initialized');
                    break;
                case 'recordingStarted':
                    logger.info({ callId: message.callId }, 'Recording started in worker');
                    break;
                case 'recordingStopped':
                    logger.info({ callId: message.callId }, 'Recording stopped in worker');
                    break;
                case 'uploadComplete':
                    logger.info({ callId: message.callId, key: message.key }, 'Recording uploaded to S3');
                    break;
                case 'error':
                    logger.error({ error: message.error, callId: message.callId }, 'Recording worker error');
                    break;
            }
        });

        this.worker.on('error', (error) => {
            logger.error('Recording worker error:', error);
        });

        this.worker.on('exit', (code) => {
            logger.info({ code }, 'Recording worker exited');
        });
    }

    startRecording(callId) {
        if (!this.isInitialized) {
            logger.warn('Attempting to start recording before worker initialization');
        }
        this.worker.postMessage({ type: 'start', callId });
    }

    writeCallerAudio(chunk) {
        if (this.isInitialized) {
            this.worker.postMessage({ type: 'callerAudio', chunk });
        }
    }

    writeAgentAudio(chunk) {
        if (this.isInitialized) {
            this.worker.postMessage({ type: 'agentAudio', chunk });
        }
    }

    async stopRecording() {
        if (this.isInitialized) {
            this.worker.postMessage({ type: 'stop' });
        }
    }

    async cleanup() {
        try {
            if (this.worker) {
                await this.worker.terminate();
                logger.info('Recording worker terminated');
            }
        } catch (error) {
            logger.error('Error terminating recording worker:', error);
        }
    }
}