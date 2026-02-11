// import fs from 'fs';
// import path from 'path';

// export class ConversationReplayEngine {
//   constructor(options) {
//     this.ws = options.ws;
//     this.callId = options.callId;
//     this.sequenceRef = options.sequenceRef;
//     this.streamSid = options.streamSid;
//     this.chunkMs = options.chunkMs;
//     this.sampleRate = options.sampleRate;
//     this.scenario = options.scenario;
//     this.metrics = options.metrics;

//     this.steps = this.scenario.steps || [];
//     this.current = 0;
//     this.lastAgentText = "";
//     this.ended = false;

//     this.steps = [
//         { audio: './hi_name_xyzzy.ulaw' },
//         { audio: './yes_please.ulaw' }
//      ];
     

//     this.bytesPerMs = this.sampleRate / 1000;
//     this.chunkSize = this.bytesPerMs * this.chunkMs;
//   }

//   /* -------------------- PUBLIC START -------------------- */

//   start() {
//     if (!this.steps.length) {
//       console.log(`[${this.callId}] No steps in scenario`);
//       return;
//     }

//     console.log(`[${this.callId}] Starting conversation replay`);
//     this._sendCurrentStep();
//   }

//   /* -------------------- PUBLIC: TURN COMPLETE -------------------- */

//   handleTurnComplete() {
//     if (this.ended) return;

//     const step = this.steps[this.current];

//     // Optional validation
//     if (step.expectAgentContains) {
//       if (
//         !this.lastAgentText ||
//         !this.lastAgentText
//           .toLowerCase()
//           .includes(step.expectAgentContains.toLowerCase())
//       ) {
//         console.log(
//           `[${this.callId}] ❌ Agent response mismatch. Expected: ${step.expectAgentContains}`
//         );

//         this.metrics.failed = (this.metrics.failed || 0) + 1;
//         this._endCall();
//         return;
//       }
//     }

//     this.current++;

//     if (this.current >= this.steps.length) {
//       console.log(`[${this.callId}] ✅ Scenario complete`);
//       this.metrics.completed = (this.metrics.completed || 0) + 1;
//       this._endCall();
//       return;
//     }

//     this._sendCurrentStep();
//   }

//   /* -------------------- PUBLIC: CAPTURE TRANSCRIPT -------------------- */

//   captureAgentTranscript(text) {
//     this.lastAgentText = text || "";
//   }

//   /* -------------------- AUDIO STREAMING -------------------- */

//   _sendCurrentStep() {
//     const step = this.steps[this.current];
//     const filePath = path.resolve(step.audio);

//     console.log(
//       `[${this.callId}] ▶ Sending step ${this.current + 1}: ${step.audio}`
//     );

//     const buffer = fs.readFileSync(filePath);

//     let offset = 0;

//     const sendFrame = () => {
//       if (this.ended) return;
//       if (offset >= buffer.length) return;

//       const chunk = buffer.slice(offset, offset + this.chunkSize);
//       offset += this.chunkSize;

//       this.ws.send(JSON.stringify({
//         event: "media",
//         sequenceNumber: this.sequenceRef(),
//         media: {
//           payload: chunk.toString("base64")
//         }
//       }));

//       setTimeout(sendFrame, this.chunkMs);
//     };

//     sendFrame();
//   }

//   /* -------------------- END CALL -------------------- */

//   _endCall() {
//     if (this.ended) return;
//     this.ended = true;

//     console.log(`[${this.callId}] 🔚 Ending call`);

//     try {
//       this.ws.send(JSON.stringify({ event: "stop" }));
//     } catch (err) {
//       console.error(`[${this.callId}] Error sending stop event`, err);
//     }

//     try {
//       this.ws.close();
//     } catch (err) {}
//   }
// }

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class ConversationReplayEngine {
  constructor({ ws, callId, sequenceRef, chunkMs, sampleRate }) {
    this.ws = ws;
    this.callId = callId;
    this.sequenceRef = sequenceRef;
    this.chunkMs = chunkMs;
    this.sampleRate = sampleRate;

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
    console.log(`[${this.callId}] Starting replay`);
    this._sendCurrentStep();
  }

  handleTurnComplete() {
    if (this.ended) return;

    this.current++;

    if (this.current >= this.steps.length) {
      console.log(`[${this.callId}] All steps done`);
      this._endCall();
      return;
    }

    this._sendCurrentStep();
  }

  _sendCurrentStep() {
    
    const step = this.steps[this.current];
    const filePath = path.join(__dirname, step.audio);


    console.log(`[${this.callId}] Sending: ${step.audio}`);

    const buffer = fs.readFileSync(filePath);
    let offset = 0;

    const sendFrame = () => {
      if (this.ended) return;
      if (offset >= buffer.length) return;

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

    console.log(`[${this.callId}] Ending call`);

    this.ws.send(JSON.stringify({ event: "stop" }));
    this.ws.close();
  }
}

