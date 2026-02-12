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
    this.waitingForWelcome = false;
    this.isUserSpeaking = false;
    this.varOrd = 0;
    this.currentStepIndex = 0;
    this.hasSentFirstUserAudio = false;
    this.lastMediaTime = null;
    this.silenceTimer = null;
    this.welcomeMediaCount = 0;
    this.steps = [
      { audio: './hi_name.ulaw' },
      { audio: './yes_please.ulaw' }
    ];

    this.current = -1;
    this.ended = false;

    this.bytesPerMs = this.sampleRate / 1000;
    this.chunkSize = this.bytesPerMs * this.chunkMs;
  }

  start() {
    console.log("🎬 Starting conversation");
    // this._sendCurrentStep();
    this.waitingForWelcome = true;
  }

  onServerMessage(data) {
    if(!data) {
      console.log("No data on on server")
      return;
    }
//     if(data.event === "media" && !this.hasSentFirstUserAudio){
//       this.welcomeMediaCount++;
//            clearTimeout(this.silenceTimer)
//            this.silenceTimer = setTimeout(()=>{
//             if(this.welcomeMediaCount > 10){
//  console.log("agent stop spealing silence detected")
//                 this.hasSentFirstUserAudio = true;
//               this._sendCurrentStep();
//             }
           
//            }, 1500)
//     }

    if (data.event === "stop_tts") {
      console.log("🛑 Received stop_tts from server");
      // if(!this.hasSentFirstUserAudio) return;
      this._nextStep();
    }
  }

  _nextStep() {
    if(this.isUserSpeaking){
      console.log("user still speaking")
      return;
    }
    this.current++;

    if (this.current >= this.steps.length) {
      console.log("✅ All steps complete");
      this._endCall();
      return;
    }

    this._sendCurrentStep();
  }

  _sendCurrentStep() {
    if(this.isUserSpeaking) return;
    this.isUserSpeaking= true;
    this.varOrd++;
    const step = this.steps[this.current];
    const filePath = path.join(__dirname, step.audio);

    console.log(`▶ Sending step ${this.current }: ${step.audio}`);

    const buffer = fs.readFileSync(filePath);
    let offset = 0;

    const sendFrame = () => {
      if (this.ended) return;

      if (offset >= buffer.length) {
   
        const silentChunk = Buffer.alloc(this.chunkSize,0xFF )
        let silenceFrames = 1000/ this.chunkMs;
        for(let i=0;i< silenceFrames;i++){
          this.ws.send(JSON.stringify({
            event: 'media',
            sequenceNumber: this.sequenceRef(),
            media: {payload: silentChunk.toString("base64")}
          }))
        }
           console.log("📌 User finished speaking → sending mark");

      setTimeout(()=>{
        console.log("mark event")
          this.ws.send(JSON.stringify({
          event: "mark",
          mark: { name: "end_of_user_audio" }
        }));
      },1000)
       
        this.isUserSpeaking = false;
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




