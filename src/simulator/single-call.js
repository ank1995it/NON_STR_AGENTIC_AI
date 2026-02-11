// single-call.js
import WebSocket from 'ws';
import { ConversationEngine } from './turn.js';
import { CONFIG } from './config.js';

export function runSingleCall() {
  return new Promise((resolve, reject) => {
    const callId = `sim-${Date.now()}`;
    const streamSid = `stream-${callId}`;
    let seq = 1;

    const wsUrl =
      `ws://${CONFIG.HOST}:${CONFIG.PORT}` +
      `${CONFIG.WS_PREFIX}/${callId}/${CONFIG.VOICE_DATA}/${CONFIG.LLM_URL}`;

    console.log("Connecting to:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.on("open", () => {
      console.log("✅ WebSocket connected");

      ws.send(JSON.stringify({
        event: "start",
        sequenceNumber: seq++,
        start: {
          callSid: callId,
          streamSid,
          mediaFormat: {
            encoding: "audio/x-mulaw",
            sampleRate: 8000,
            channels: 1
          }
        }
      }));

      const engine = new ConversationEngine({
        ws,
        callId,
        sequenceRef: () => seq++
      });

      ws.on("message", (msg) => {
        const data = JSON.parse(msg.toString());
        engine.onServerMessage(data);
      });

      engine.start();
    });

    ws.on("close", () => {
      console.log("WS closed");
      resolve();
    });

    ws.on("error", reject);
  });
}
