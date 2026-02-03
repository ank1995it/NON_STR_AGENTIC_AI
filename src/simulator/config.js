import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
    WS_URL: 'ws://127.0.0.1:17070/v1/calls/stream',
  
    AUDIO_FILE: path.join(__dirname, 'audio.ulaw'),
  
    SAMPLE_RATE: 8000,
    CHUNK_MS: 20,                 // real-time pacing
    CALL_DURATION_SEC: 15,        // per call
  
    INITIAL_CALLS: 5,
    MAX_CALLS: 1000,
    RAMP_UP_EVERY_MS: 2000,       // add calls every 2s
    RAMP_UP_COUNT: 10             // how many calls per ramp
  };
  