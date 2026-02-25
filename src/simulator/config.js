// src/simulator/config.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  HOST: 'localhost',
  PORT: 17070,
  WS_PREFIX: '/media-stream',

  VOICE_DATA: 'en-US',
  LLM_URL_RAW: 'http://localhost:17000/query',
  LLM_URL_ENCODED: encodeURIComponent('http://localhost:17000/query'),

  AUDIO_FILE: path.join(__dirname, 'audio.ulaw'),

  SAMPLE_RATE: 8000,
  CHUNK_MS: 20,

  INITIAL_CALLS: 1,
  MAX_CALLS: 5,
  RAMP_UP_EVERY_MS: 20000,
  RAMP_UP_COUNT: 5
};
