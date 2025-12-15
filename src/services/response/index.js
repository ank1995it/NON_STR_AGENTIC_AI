// src/services/response/index.js
import { ResponseGeneratorFactory } from './factory.js';

export class ResponseService {
    constructor(config, logger) {
        this.generator = ResponseGeneratorFactory.createGenerator(config);
        this.logger = logger
    }

    async generateResponse(transcript, sessionId , interrupted,isSilent,redisData) {
        return await this.generator.generateResponse(transcript, sessionId,interrupted,isSilent,redisData);
    }

    clearHistory(sessionId) {
        this.generator.clearHistory(sessionId);
    }
}