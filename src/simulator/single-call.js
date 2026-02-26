// single-call.js
import WebSocket from 'ws';
import { ConversationEngine } from './turn.js';
import { CONFIG } from './config.js';
import { metrics } from "./metrics.js";

export function runSingleCall() {
  return new Promise((resolve, reject) => {
    const callId = `sim-${Date.now()}`;
    const streamSid = `stream-${callId}`;
    let seq = 1;

    const sttObj = {
      locale: 'en-US'
    }

    const sttBase64 = Buffer.from(JSON.stringify(sttObj))
                             .toString("base64")

    const wsUrl =
      `ws://${CONFIG.HOST}:${CONFIG.PORT}` +
      `${CONFIG.WS_PREFIX}/${callId}/${CONFIG.VOICE_DATA}/${CONFIG.LLM_URL}`;

    console.log("Connecting to:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.on("open", async () => {
  console.log("✅ WebSocket connected");
  metrics.callConnected();
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
      },
      customParameters: {
        sttData: sttBase64
      }
    }
  }));

  const engine = new ConversationEngine({
    ws,
    callId,
    sequenceRef: () => seq++,
    onComplete: () => {
      metrics.callCompleted();
    }
  });

  // 🔥 CALL INITIALIZE HERE
  await engine.initialize();

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    engine.onServerMessage(data);
  });

  engine.start();
});

    ws.on("close", () => {
      console.log("WS closed");
      metrics.callCompleted();
      resolve();
    });

    ws.on("error", (err) => {
      console.error("WS Error:", err);
      metrics.callFailed();
      reject(err);
    });
  });
}
