import https from 'https';
import { logger } from '../../utils/logger.js';
import { performance } from 'node:perf_hooks';

export class AzureTTSService {
  /**
   * @param {object} config - Configuration object.
   * @param {object} config.azure - Azure-specific configuration.
   * @param {string} config.azure.speechKey - Your Azure subscription key.
   * @param {string} config.azure.speechRegion - Your Azure service region (e.g. "westus").
   * @param {object} config.tts - TTS-specific configuration.
   * @param {string} config.tts.azureVoiceId - The voice ID to be used.
   */
   constructor(voiceId, config) {
    this.config = config;
    this.voiceId = voiceId;
    // Use raw PCM output format (8kHz, 8-bit, mono) as required.
    this.outputFormat = 'raw-8khz-8bit-mono-mulaw';
    // Use a keep-alive agent for lower latency.
    this.agent = new https.Agent({ keepAlive: true });
  }

  /**
   * Synthesizes speech from the given text using Azure’s HTTP REST endpoint.
   * Returns an async generator that yields base64‑encoded audio chunks (160 bytes each) as they are received.
   *
   * @param {string} text - The text to synthesize.
   * @param {string} callId - An identifier for logging purposes.
   * @returns {AsyncGenerator<string>} - An async generator of audio chunks.
   */
  async *synthesize(text, callId) {
    logger.info({ callId, textLength: text?.length }, "Starting Azure TTS synthesis via HTTP");
    //logger.error(text)
    const botResponse = JSON.parse(text);    
    // Build the SSML payload as required by Azure TTS REST API.
    const voiceName = this.voiceId || this.config.tts.azureVoiceId;
    const ssml = `<speak version="1.0" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice xml:lang="en-US" name="${voiceName}">
          <mstts:express-as style="${botResponse?.emotion}" styledegree="2">
            ${botResponse?.assistant}
            </mstts:express-as>
        </voice>
    </speak>`;

    const options = {
      method: 'POST',
      hostname: this.config.azure.speechEndpoint,
      path: '/tts/cognitiveservices/v1',
      headers: {
      },
      agent: this.agent,
      maxRedirects: 20
    };

    // Wrap the HTTPS request in a Promise to obtain the response stream.
    let startTime= 0; let count=0
    const res = await new Promise((resolve, reject) => {
      startTime = performance.now();
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          let errorData = '';
          res.on('data', chunk => errorData += chunk);
          res.on('end', () => {
            reject(new Error(`Azure TTS request failed with status code: ${res.statusCode}. Details: ${errorData}`));
          });
        } else {
          resolve(res);
        }
      });
      req.on('error', error => {
        logger.error({callId},'Azure TTS HTTP request error:', error);
        reject(error);
      });
      req.write(ssml);
      req.end();
    });

    // Buffer to accumulate data from the response stream.
    let buffer = Buffer.alloc(0);
    // As soon as enough data is available (>= 160 bytes), slice and yield.
    for await (const chunk of res) {
      if(count++===0){
        logger.info({ callId, firstChunkDelayMs: (performance.now() - startTime).toFixed(2) }, "First audio chunk received from Azure TTS");
      }
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 160) {
        const piece = buffer.slice(0, 160);
        yield piece.toString('base64');
        buffer = buffer.slice(160);
      }
    }
    // Yield any remaining data (if any) as the final chunk.
    if (buffer.length > 0) {
      yield buffer.toString('base64');
    }
  }

  /**
   * Cleans up resources if necessary.
   */
  cleanup() {
    logger.info("Azure TTS HTTP service cleanup completed.");
    if (this.agent) {
      this.agent.destroy();
    }
  }
}
