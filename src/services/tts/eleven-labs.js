import { ElevenLabsClient } from 'elevenlabs';
import { logger } from '../../utils/logger.js';

const CHUNK_SIZE = 160; // Chunk size in bytes

export class ElevenLabsTtsService {
  /**
   * @param {object} config - Configuration object.
   * @param {string} config.apiKey - Your ElevenLabs API key.
   * @param {object} config.tts - TTS-specific configuration.
   * @param {string} config.tts.voiceId - Default voice ID.
   */
  constructor(voiceId, config,logger) {
    this.config = config;
    this.logger = logger;
    this.client = new ElevenLabsClient({
      apiKey: config.elevenlabs.apiKey,
    });
    this.voiceId = voiceId;
    logger.info("New Object TTS")
  }

  /**
   * Async generator that splits the provided audio buffer into chunks of CHUNK_SIZE bytes,
   * and yields each chunk as a base64‑encoded string.
   *
   * @param {Buffer} audioBuffer - The complete audio Buffer.
   */
  async *generateAudioChunks(audioBuffer) {
    for (let offset = 0; offset < audioBuffer.length; offset += CHUNK_SIZE) {
      const chunk = audioBuffer.slice(offset, offset + CHUNK_SIZE);
      yield chunk.toString("base64");
    }
  }

  /**
   * Synthesizes speech using ElevenLabs TTS. It requests ulaw audio
   * (ulaw_8000) compatible with Twilio telephony and a chunk length schedule
   * to trigger audio chunks every 100 characters.
   *
   * The method collects the raw audio data from ElevenLabs, then returns an async generator
   * that yields base64‑encoded audio chunks without modifying the data further.
   *
   * @param {string} text - The text to synthesize (should end with a space).
   * @param {string} [callId] - Optional identifier for logging.
   * @returns {Promise<AsyncIterable<string>>} - A generator yielding base64‑encoded audio chunks.
   */
  async *synthesize(text, callId) {
    try {
      this.logger.info({ callId, textLength: text?.length }, "Starting ElevenLabs TTS synthesis");
      this.logger.info(this.client);
      this.logger.info(this.config.elevenlabs.voiceId);
      this.logger.info(this.config.elevenlabs.modelId);

      //const botResponse = JSON.parse(text);
      const initialTime = performance.now();
      const audioStream = await this.client.textToSpeech.convertAsStream(this.voiceId || this.config.elevenlabs.voiceId, {
	      text,
        model_id: this.config.elevenlabs.modelId,
        output_format: 'ulaw_8000', // ElevenLabs returns ulaw audio,
        apply_text_normalization:'off',
        optimize_streaming_latency:3,
        voice_settings:{
          use_speaker_boost:false,
          stability:0.5,
          similarity_boost:0.6,
          speed:0.9
        }
        
      });
      
      // Collect the raw audio stream into a Buffer
      let count = 0;
      for await (const chunk of audioStream) {
        if(count===0){
           this.logger.info({ callId, latency: (performance.now() - initialTime).toFixed(2) }, "Received first audio chunk from ElevenLabs");
           count++;
        }
          yield chunk;//chunks.push(chunk);
      }
      // const audioBuffer = Buffer.concat(chunks);
      // if (!audioBuffer || audioBuffer.length === 0) {
      //   throw new Error("Invalid ElevenLabs response: Empty audio data");
      // }

      // Return an async generator that yields base64‑encoded chunks of the raw audio data
      //return this.generateAudioChunks(audioBuffer);
    } catch (error) {
      logger.error(error, "ElevenLabs TTS synthesis error:");
      throw error;
    }
  }

  /**
   * Clean up any resources if necessary.
   */
  cleanup() {
    logger.info("ElevenLabs TTS service cleanup completed.");
  }
}
