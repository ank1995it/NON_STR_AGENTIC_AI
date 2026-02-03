import WebSocket from 'ws';
import fs from 'fs';
import { CONFIG } from './config.js';

export function simulateCall(callIndex) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(CONFIG.WS_URL);

    const callSid = `CA_LOAD_${callIndex}_${Date.now()}`;
    const streamSid = `MZ_STREAM_${callIndex}_${Date.now()}`;

    let seq = 1;
    let audioOffset = 0;

    const audioBuffer = fs.readFileSync(CONFIG.AUDIO_FILE);

    ws.on('open', async () => {
      // START
      ws.send(JSON.stringify({
        event: 'start',
        sequenceNumber: seq++,
        start: {
          accountSid: 'AC_LOAD_TEST',
          callSid,
          streamSid,
          tracks: ['inbound'],
          mediaFormat: {
            encoding: 'audio/x-mulaw',
            sampleRate: 8000,
            channels: 1
          }
        }
      }));

      const bytesPerMs = CONFIG.SAMPLE_RATE / 1000;
      const chunkSize = bytesPerMs * CONFIG.CHUNK_MS;

      const interval = setInterval(() => {
        if (audioOffset >= audioBuffer.length) {
          clearInterval(interval);

          ws.send(JSON.stringify({
            event: 'stop',
            sequenceNumber: seq++,
            stop: { accountSid: 'AC_LOAD_TEST', callSid }
          }));

          ws.close();
          return;
        }

        const chunk = audioBuffer.slice(
          audioOffset,
          audioOffset + chunkSize
        );

        audioOffset += chunkSize;

        ws.send(JSON.stringify({
          event: 'media',
          sequenceNumber: seq++,
          media: {
            track: 'inbound',
            timestamp: Date.now().toString(),
            chunk: seq.toString(),
            payload: chunk.toString('base64')
          }
        }));
      }, CONFIG.CHUNK_MS);
    });

    ws.on('message', () => {
      // Optional: count TTS frames
    });

    ws.on('close', () => resolve());
    ws.on('error', reject);
  });
}
