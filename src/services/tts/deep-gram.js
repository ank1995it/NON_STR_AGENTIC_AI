import { createClient } from '@deepgram/sdk';
import { logger } from '../../utils/logger.js';
import { Readable } from 'stream';

/**
 * DeepgramTtsService wraps the Deepgram Text-to-Speech API into an async generator
 * that yields base64-encoded audio chunks.
 */
export class DeepgramTtsService {
  /**
   * @param {object} config
   * @param {string} config.apiKey - Deepgram API key.
   * @param {string} [config.model] - Deepgram TTS model (e.g. 'aura-asteria-en').
   */
  constructor(config) {
    this.config = config;
    this.dgClient = createClient('2bac3c9160a78ba9f13b81644d2d7ad21103d4f6');
    logger.info('Initialized Deepgram TTS service');
  }

  /**
   * Async generator that reads audio stream and yields base64 chunks.
   * @param {Readable} stream - Readable audio stream from Deepgram.
   * @param {number} [chunkSize=4096] - Bytes per chunk.
   */
  async *generateAudioChunks(stream, chunkSize = 4096) {
    for await (const chunk of stream) {
      // If chunk is a Buffer, split into smaller pieces
      if (Buffer.isBuffer(chunk) && chunk.length > chunkSize) {
        for (let offset = 0; offset < chunk.length; offset += chunkSize) {
          const slice = chunk.slice(offset, offset + chunkSize);
          yield slice.toString('base64');
        }
      } else { 
        yield (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)).toString('base64');
      }
    }
  }

  /**
   * Synthesizes speech for given text and returns an async generator of base64 audio chunks.
   * @param {string} text - Input text to speak.
   * @param {string} [callId] - Optional identifier for logging.
   * @returns {Promise<AsyncIterable<string>>}
   */
  async synthesize(text, callId) {
    logger.info({ callId, textLength: text.length }, 'Starting Deepgram TTS synthesis');
    try {
    const botResponse = JSON.parse(text);      
      const response = await this.dgClient.speak.request(
        { text:botResponse.assistant },
        { model: this.config.model || 'aura-2-phoebe-en' ,
            encoding:'mulaw',
            container:'none',
            sample_rate:8000
            
        }
      );
      const audioStream = await response.getStream();
      if (!audioStream) throw new Error('Deepgram TTS returned no audio stream');
      return this.generateAudioChunks(audioStream);
    } catch (error) {
      logger.error('Deepgram TTS synthesis error:', error);
      throw error;
    }
  }

  /**
   * Clean-up (no-op, placeholder for interface consistency).
   */
  cleanup() {
    logger.info('Deepgram TTS service cleanup completed');
  }
}
