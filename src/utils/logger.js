// src/utils/logger.js
import pino from 'pino';
import { config } from '../config/index.js';
import { getAppInsightClient } from '../utils/appinsights.js';
import { type } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/SpeechServiceConfig.js';

export const logger = pino({
    level: config.logging.level,
    hooks: {
        logMethod(args, method) {
            const [msg, obj] = args;

            const appInsightClient = getAppInsightClient();

            const bindings = this.bindings? this.bindings() : {}
            const properties = {
                ...bindings,
                ...(typeof obj === 'object' && obj !=null ? obj : {})
            }

            let aiMsg = typeof msg === "string"? msg : JSON.stringify(msg)

            if(typeof obj === 'string'){
                aiMsg += `| ${obj}`
            }
            
             if(appInsightClient && typeof appInsightClient.trackTrace == 'function'){
                 appInsightClient.trackTrace({
                message: aiMsg,
                properties
            });
            }

            method.apply(this, args);
        }
    }, transport: config.logging.prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        }
        : undefined
});


