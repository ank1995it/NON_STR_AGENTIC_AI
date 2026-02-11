// conversation-engine.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ConversationEngine {
  constructor({ ws, callId, sequenceRef, sampleRate = 8000, chunkMs = 20 }) {
    this.ws = ws;
    this.callId = callId;
    this.sequenceRef = sequenceRef;
    this.sampleRate = sampleRate;
    this.chunkMs = chunkMs;

    this.steps = [
      { audio: './hi_name.ulaw' },
      { audio: './yes_please.ulaw' }
    ];

    this.current = 0;
    this.ended = false;

    this.bytesPerMs = this.sampleRate / 1000;
    this.chunkSize = this.bytesPerMs * this.chunkMs;
  }

  start() {
    console.log("🎬 Starting conversation");
    this._sendCurrentStep();
  }

  onServerMessage(data) {
    if (data.event === "stop_tts") {
      console.log("🛑 Received stop_tts from server");
      this._nextStep();
    }
  }

  _nextStep() {
    this.current++;

    if (this.current >= this.steps.length) {
      console.log("✅ All steps complete");
      this._endCall();
      return;
    }

    this._sendCurrentStep();
  }

  _sendCurrentStep() {
    const step = this.steps[this.current];
    const filePath = path.join(__dirname, step.audio);

    console.log(`▶ Sending step ${this.current + 1}: ${step.audio}`);

    const buffer = fs.readFileSync(filePath);
    let offset = 0;

    const sendFrame = () => {
      if (this.ended) return;

      if (offset >= buffer.length) {
        console.log("📌 User finished speaking → sending mark");

        this.ws.send(JSON.stringify({
          event: "mark",
          mark: { name: "end_of_user_audio" }
        }));

        return;
      }

      const chunk = buffer.slice(offset, offset + this.chunkSize);
      offset += this.chunkSize;

      this.ws.send(JSON.stringify({
        event: "media",
        sequenceNumber: this.sequenceRef(),
        media: {
          payload: chunk.toString("base64")
        }
      }));

      setTimeout(sendFrame, this.chunkMs);
    };

    sendFrame();
  }

  _endCall() {
    if (this.ended) return;
    this.ended = true;

    console.log("🔚 Ending call");

    this.ws.send(JSON.stringify({ event: "stop" }));
    this.ws.close();
  }
}
