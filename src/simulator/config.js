// src/simulator/config.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  HOST: 'localhost',
  PORT: 5050,
  WS_PREFIX: '/v1/calls/media-stream',

  VOICE_DATA: 'en-US',
  LLM_URL: encodeURIComponent('http://localhost:17000/query'),

  AUDIO_FILE: path.join(__dirname, 'audio.ulaw'),

  SAMPLE_RATE: 8000,
  CHUNK_MS: 20,

  INITIAL_CALLS: 5,
  MAX_CALLS: 1000,
  RAMP_UP_EVERY_MS: 2000,
  RAMP_UP_COUNT: 10
};
