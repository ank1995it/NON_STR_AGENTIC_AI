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

    async  generateResponse(transcript, sessionId, interrupted, isSilent, llmUrl) {
        const startTime = process.hrtime.bigint();
        const maxRetries = 2;
        const baseDelayMs = 500;
        const requestTimeoutMs = 12000; 
    
        const url = new URL(llmUrl || this.apiUrl);
        url.searchParams.set('STT_output', transcript);
        url.searchParams.set('callid', sessionId || 'default');
        url.searchParams.set('interrupted', String(interrupted ?? false));
        url.searchParams.set('silence', String(isSilent ?? false));
    
        logger.info({ 
            url: url.toString(), 
            interrupted, 
            silence: isSilent 
        }, 'Generating response from local API' );
    
        let lastError = null;
        let attempt = 0;
    
        while (attempt <= maxRetries) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);
    
            try {
                const response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: { 'Accept': 'text/plain' },
                    signal: controller.signal,
                });
    
                clearTimeout(timeoutId);
    
                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'No response body');
                    
                    if (response.status >= 400 && response.status < 500) {
                        // 4xx → client error → no retry
                        logger.error('Local API client error', {
                            type: 'local_api_client_error',
                            status: response.status,
                            sessionId,
                            body: errorText.slice(0, 500),
                        });
                        throw Object.assign(new Error(`Client error ${response.status}`), {
                            status: response.status,
                            body: errorText,
                            type: 'CLIENT_ERROR',
                        });
                    }
    
                    // 5xx → retryable
                    throw Object.assign(new Error(`Server error ${response.status}`), {
                        status: response.status,
                        type: 'SERVER_ERROR',
                    });
                }
    
                const generatedResponse = await response.text();
    
                const endTime = process.hrtime.bigint();
                const durationNs = endTime - startTime;
                const durationMs = Number(durationNs) / 1_000_000;
    
                logger.info('Local API success', {
                    type: 'local_api_latency',
                    latencyMs: Math.round(durationMs),
                    sessionId,
                });
    
                return generatedResponse;
    
            } catch (err) {
                clearTimeout(timeoutId);
                lastError = err;
    
                const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
                const isNetworkError = 
                    err.name === 'TypeError' ||          
                    ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED'].includes(err.code) ||
                    isTimeout;
    
                const isServerError = err.type === 'SERVER_ERROR' || (err.status >= 500 && err.status < 600);
    
                const shouldRetry = attempt < maxRetries && (isNetworkError || isServerError);
    
                logger.warn('Local API attempt failed', {
                    attempt: attempt + 1,
                    maxRetries,
                    shouldRetry,
                    errorType: err.name || err.type || 'unknown',
                    status: err.status ?? null,
                    message: err.message?.slice(0, 300) ?? 'no message',
                    code: err.code ?? null,
                    sessionId,
                });
    
                if (!shouldRetry) {
                    break;
                }
    
                // Exponential backoff: 500 → 1000 → 2000 → 4000 ...
                const delayMs = baseDelayMs * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
    
            attempt++;
        }
    
        // Final failure
        logger.error('Local API final failure', {
            type: 'local_api_final_failure',
            attempts: attempt + 1,
            sessionId,
            lastError: lastError?.message ?? 'unknown',
            lastErrorCode: lastError?.code ?? null,
            lastErrorStatus: lastError?.status ?? null,
        });
    
        throw lastError || new Error('All retry attempts failed');
    }

    
}
