// src/services/tts/index.js
import { config } from '../../config/index.js';
import { PollyTTSService } from './polly.js';
import { TwiMLTTSService } from './twiml.js';
import { AzureTTSService } from './azure-speech.js';
import { ElevenLabsTtsService } from './eleven-labs.js';
import { OpenAzureTTSService } from './openai-azure-speech.js';
import { DeepgramTtsService } from './deep-gram.js';

export class TTSService {
    constructor(ttsService, voiceId, logger) {
        this.logger= logger
        switch (ttsService || config.tts.provider.toLowerCase()) {
            // case 'polly':
            //     this.logger.info('Using AWS Polly for TTS');
            //     this.service = new PollyTTSService(voiceId, config);
            //     break;
            case 'elevenlabs':
                this.logger.info('Using Eleven labs Eleven Labs for TTS');
                this.service = new ElevenLabsTtsService(voiceId,config,logger);
                break;
            case 'azure':
                this.logger.info('Using Azure Speech for TTS');
                this.service = new AzureTTSService(voiceId,config,logger);
                break;
            // case 'openazure':
            //     this.logger.info('Using Azure Speech for TTS');
            //     this.service = new OpenAzureTTSService(voiceId,config);
            //     break;
            // case 'deepgram':            
            //     this.logger.info('Using Deepgram for TTS');
            //     this.service = new DeepgramTtsService(voiceId,config);
            //     break;
            default:
                this.logger.warn(`Unknown TTS provider: ${config.tts.provider}, defaulting to Eleven Labs`);
                this.service = new ElevenLabsTtsService(voiceId,config,logger);
        }
    }

     synthesize(text, callId) {
        return  this.service.synthesize(text, callId);
    }
}

