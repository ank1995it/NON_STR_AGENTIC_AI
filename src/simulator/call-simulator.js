import WebSocket from 'ws';
import { CONFIG } from './config.js';
import { ConversationReplayEngine } from './turn.js';

export function simulateCall(callNumber) {
  return new Promise((resolve, reject) => {
    const callId = `loadtest-${process.pid}-${Date.now()}-${callNumber}`;
    const streamSid = `stream-${callId}`;

    const wsUrl =
      `ws://${CONFIG.HOST}:${CONFIG.PORT}` +
      `${CONFIG.WS_PREFIX}/${callId}/${CONFIG.VOICE_DATA}/${CONFIG.LLM_URL}`;

    const ws = new WebSocket(wsUrl);

    let seq = 1;   // MUST be declared before passing to engine

    let replayEngine;  // declare first

    ws.on('open', () => {
      console.log(`✅ WS connected: ${callId}`);

      // START event
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

      // Now create ReplayEngine (after ws + seq exist)
      replayEngine = new ConversationReplayEngine({
        ws,
        callId,
        sequenceRef: () => seq++,
        streamSid,
        chunkMs: CONFIG.CHUNK_MS,
        sampleRate: CONFIG.SAMPLE_RATE
      });

      replayEngine.start();
    });

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);

        if (data.event === 'stop_tts') {
          replayEngine?.handleTurnComplete();
        }

        if (data.event === 'agent_transcript') {
          replayEngine?.captureAgentTranscript(data.text);
        }

      } catch (err) {
        // Ignore non-JSON frames
      }
    });

    ws.on('close', () => {
      console.log(`🔚 Call ended: ${callId}`);
      resolve();
    });

    ws.on('error', (err) => {
      console.error(`❌ WS error (${callId}):`, err.message);
      reject(err);
    });
  });
}
