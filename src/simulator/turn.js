// // conversation-engine.js
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export class ConversationEngine {
//   constructor({ ws, callId, sequenceRef, sampleRate = 8000, chunkMs = 20 }) {
//     this.ws = ws;
//     this.callId = callId;
//     this.sequenceRef = sequenceRef;
//     this.sampleRate = sampleRate;
//     this.chunkMs = chunkMs;

//     this.steps = [
//       { audio: './hi_name.ulaw' },
//       { audio: './yes_please.ulaw' }
//     ];

//     this.current = 0;
//     this.ended = false;

//     this.bytesPerMs = this.sampleRate / 1000;
//     this.chunkSize = this.bytesPerMs * this.chunkMs;
//   }

//   start() {
//     console.log("🎬 Starting conversation");
//     this._sendCurrentStep();
//   }

//   onServerMessage(data) {
//     if (data.event === "stop_tts") {
//       console.log("🛑 Received stop_tts from server");
//       this._nextStep();
//     }
//   }

//   _nextStep() {
//     this.current++;

//     if (this.current >= this.steps.length) {
//       console.log("✅ All steps complete");
//       this._endCall();
//       return;
//     }

//     this._sendCurrentStep();
//   }

//   _sendCurrentStep() {
//     const step = this.steps[this.current];
//     const filePath = path.join(__dirname, step.audio);

//     console.log(`▶ Sending step ${this.current + 1}: ${step.audio}`);

//     const buffer = fs.readFileSync(filePath);
//     let offset = 0;

//     const sendFrame = () => {
//       if (this.ended) return;

//       if (offset >= buffer.length) {
//         console.log("📌 User finished speaking → sending mark");

//         this.ws.send(JSON.stringify({
//           event: "mark",
//           mark: { name: "end_of_user_audio" }
//         }));

//         return;
//       }

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

//   _endCall() {
//     if (this.ended) return;
//     this.ended = true;

//     console.log("🔚 Ending call");

//     this.ws.send(JSON.stringify({ event: "stop" }));
//     this.ws.close();
//   }
// }



//grokk 

// turn.js
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

    this.current = -1;               // start before first step
    this.ended = false;
    this.waitingForAgentTurn = true; // initial state: waiting for welcome

    this.bytesPerMs = this.sampleRate / 1000;
    this.chunkSize = this.bytesPerMs * this.chunkMs;

    this.pendingMarks = new Set();   // we'll track Twilio <mark> acks
  }

  start() {
    console.log(`[${this.callId}] Waiting for initial agent greeting...`);
    // Do NOT send anything yet → wait for first stop_tts (welcome)
  }

  onServerMessage(data) {
    switch (data.event) {
      case "stop_tts":
        console.log(`[${this.callId}] stop_tts received`);
        this._handleStopTts();
        break;

      case "mark":
        if (data.mark?.name) {
          console.log(`[${this.callId}] Twilio acknowledged mark: ${data.mark.name}`);
          this.pendingMarks.delete(data.mark.name);
          this._maybeSendNextUserTurn();
        }
        break;

      // optional — just for debugging
      case "agent_transcript":
        console.log(`[${this.callId}] Agent said: ${data.text || "(empty)"}`);
        break;
    }
  }

  _handleStopTts() {
    // First time → this is the welcome message finishing generation
    if (this.waitingForAgentTurn && this.current === -1) {
      console.log(`[${this.callId}] Initial agent greeting finished generating → waiting for playback to complete`);
      this.waitingForAgentTurn = false;
      // Do NOT send user audio yet — wait for Twilio mark(s)
      return;
    }

    // Later turns — TTS finished generating → wait for playback
    console.log(`[${this.callId}] Agent TTS generation done → waiting for Twilio to finish playing`);
    // Again: real delay comes from mark events, not here
  }

  // Called when we receive a mark back from Twilio
  _maybeSendNextUserTurn() {
    // Only proceed when we believe agent speech has fully played out
    // Simplest safe heuristic: no pending marks left from this turn
    if (this.pendingMarks.size === 0) {
      this.current++;

      if (this.current >= this.steps.length) {
        console.log(`[${this.callId}] All user utterances sent → ending`);
        this._endCall();
        return;
      }

      console.log(`[${this.callId}] Twilio finished playing agent audio → sending user step ${this.current + 1}`);
      this._sendCurrentStep();
    }
  }

  _sendCurrentStep() {
    const step = this.steps[this.current];
    const filePath = path.join(__dirname, step.audio);

    console.log(`[${this.callId}] ▶ Sending user audio: ${step.audio}`);

    const buffer = fs.readFileSync(filePath);
    let offset = 0;

    const sendFrame = () => {
      if (this.ended) return;
      if (offset >= buffer.length) {
        // User finished "speaking" → send a mark so we can track when Twilio played our audio
        const markName = `user_end_${this.current + 1}`;
        console.log(`[${this.callId}] User audio finished → sent mark ${markName}`);

        this.ws.send(JSON.stringify({
          event: "mark",
          streamSid: "your-stream-sid-if-you-have-it", // ← add if available in constructor
          mark: { name: markName }
        }));

        this.pendingMarks.add(markName);
        return;
      }

      const chunk = buffer.slice(offset, offset + this.chunkSize);
      offset += this.chunkSize;

      this.ws.send(JSON.stringify({
        event: "media",
        sequenceNumber: this.sequenceRef(),
        media: { payload: chunk.toString("base64") }
      }));

      setTimeout(sendFrame, this.chunkMs);
    };

    sendFrame();
  }

  _endCall() {
    if (this.ended) return;
    this.ended = true;
    console.log(`[${this.callId}] 🔚 Sending stop`);
    this.ws.send(JSON.stringify({ event: "stop" }));
    this.ws.close();
  }
}