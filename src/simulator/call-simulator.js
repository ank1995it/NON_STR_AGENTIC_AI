// src/simulator/call-simulator.js
import WebSocket from 'ws';
import fs from 'fs';
import { CONFIG } from './config.js';

export function simulateCall(callNumber) {
  return new Promise((resolve, reject) => {
    const callId = `loadtest-${process.pid}-${Date.now()}-${callNumber}`;
    const streamSid = `stream-${callId}`;

    const wsUrl =
      `ws://${CONFIG.HOST}:${CONFIG.PORT}` +
      `${CONFIG.WS_PREFIX}/${callId}/${CONFIG.VOICE_DATA}/${CONFIG.LLM_URL}`;

    const ws = new WebSocket(wsUrl);

    const audioBuffer = fs.readFileSync(CONFIG.AUDIO_FILE);
    const bytesPerMs = CONFIG.SAMPLE_RATE / 1000;
    const chunkSize = bytesPerMs * CONFIG.CHUNK_MS;

    let offset = 0;
    let seq = 1;

    ws.on('open', () => {
      console.log(`✅ WS connected: ${callId}`);

      // 1️⃣ START event (Twilio-style)
      ws.send(JSON.stringify({
        event: 'start',
        sequenceNumber: seq++,
        start: {
          callSid: callId,
          streamSid,
          mediaFormat: {
            encoding: 'audio/x-mulaw',
            sampleRate: CONFIG.SAMPLE_RATE,
            channels: 1
          }
        }
      }));

      // 2️⃣ MEDIA events (real-time pacing)
      const interval = setInterval(() => {
        if (offset >= audioBuffer.length) {
          clearInterval(interval);

          // 3️⃣ STOP event
          ws.send(JSON.stringify({
            event: 'stop',
            sequenceNumber: seq++
          }));

          ws.close();
          return;
        }

        const chunk = audioBuffer.slice(offset, offset + chunkSize);
        offset += chunkSize;

        ws.send(JSON.stringify({
          event: 'media',
          sequenceNumber: seq++,
          media: {
            payload: chunk.toString('base64')
          }
        }));
      }, CONFIG.CHUNK_MS);
    });

    ws.on('message', () => {
      // optional: count TTS frames later
    });

    ws.on('close', () => {
      console.log(`🔚 Call ended: ${callId}`);
      resolve();
    });

    ws.on('error', err => {
      console.error(`❌ WS error (${callId}):`, err.message);
      reject(err);
    });
  });
}
