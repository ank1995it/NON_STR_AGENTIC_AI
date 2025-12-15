// src/services/response/groq-generator.js
import { logger } from '../../utils/logger.js';
import { BaseResponseGenerator } from './base.js';
import { BasicResponseGenerator } from './basic-generator.js';

export class GroqResponseGenerator extends BaseResponseGenerator {
    constructor(config) {  
        super();      
        this.config = config;
        this.apiUrl = this.config.response.llmQueryURL;
        this.conversationHistory = new Map();
        this.basicGenerator = new BasicResponseGenerator();
    }

    async generateResponse(transcript, sessionId,interrupted,isSilent,llmUrl) {
        const startTime = process.hrtime();
        try {
            // Build URL with query parameters
            logger.info('Generating response from local API',llmUrl);
            logger.info('sent interruption as '+ interrupted+' on utterance '+transcript)
            const url = new URL(llmUrl || this.apiUrl);
            url.searchParams.append('STT_output', transcript);
            url.searchParams.append('callid', sessionId || 'default');
            url.searchParams.append('interrupted', interrupted || 'false');
            url.searchParams.append('silence', isSilent || 'false');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain'
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const generatedResponse = await response.text();

            const endTime = process.hrtime(startTime);
            const latencyMs = endTime[0] * 1000 + endTime[1] / 1000000;            
            logger.info({
                type: 'local_api_latency',
                latency: latencyMs,
                sessionId,
                //transcript,
                //response: generatedResponse
            });             
            return generatedResponse; //|| this.getFallbackResponse(transcript);

        } catch (error) {
            logger.error('Local API error:', error);
            //return this.getFallbackResponse(transcript);
        }
    }

    
}
