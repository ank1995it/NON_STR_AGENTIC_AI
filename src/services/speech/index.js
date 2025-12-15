// src/services/speech/index.js
import { AudioTransformer } from '../audio/transformer.js';
import { TranscribeService } from '../transcribe/index.js';
import { TTSService } from '../tts/index.js';
import { ResponseService } from '../response/index.js';
//import { TranscriptService } from '../dynamodb/index.js';
import { SpeechManager } from './smanager.js';
import { AudioRecorderService } from '../recorder/index.js';
import { WebSocketHandler } from './wshandler.js';
import { config } from '../../config/index.js';

export async function setupWebSocketHandler(connection, callId , voiceData , llmUrl, logger) {
    try {
             const decodedVoiceData = Buffer.from(voiceData, 'base64').toString('utf-8');
             logger.info({callId:callId},decodedVoiceData, 'Decoded Voice Data: '); 
             const splitVoiceData = decodedVoiceData.split('_');
             const decodedLlmUrl = Buffer.from(llmUrl, 'base64').toString('utf-8');
             logger.info({decodedLlmUrl}, 'Decoded LLM Data: ');                     
            // logger.info(callInfo, 'Call Data for tenantId: ');
            const services = {
            audioTransformer: new AudioTransformer(config, logger),
            transcribeService: new TranscribeService(config,callId,  logger),            
            ttsService: new TTSService(splitVoiceData[0],splitVoiceData[1], logger),
            responseService: new ResponseService(config, logger),
            //transcriptService: new TranscriptService(config),
            //audioRecorder: new AudioRecorderService(config), commented on 30-10-25
            cleanup: async () => {
                logger.info('Cleaning up services');
            }
        };

        const speechManager = new SpeechManager(config, logger);
        const wsHandler = new WebSocketHandler(connection.socket, speechManager, services,callId,decodedLlmUrl, logger);

        logger.info(`[${new Date().toISOString().split('T')[1].slice(0, -1)}] WebSocket handler setup complete`);
        return wsHandler;
    } catch (error) {
        logger.error(error, `[${new Date().toISOString().split('T')[1].slice(0, -1)}] Error setting up WebSocket handler:`);
        throw error;
    }
}

export { SpeechManager, WebSocketHandler };