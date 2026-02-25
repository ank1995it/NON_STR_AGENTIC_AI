import WebSocket from 'ws';
import { CONFIG } from './config.js';
import { ConversationReplayEngine } from './turn.js';
import { logger } from '../utils/logger.js';

export function simulateCall(callNumber) {
  return new Promise((resolve, reject) => {
    const callId = `loadtest-${process.pid}-${Date.now()}-${callNumber}`;
    const streamSid = `stream-${callId}`;
    const sttPayload  = {
      locale:"en-US"
    }

    const sttBase64 = Buffer.from(JSON.stringify(sttPayload))
    .toString("base64")

    const wsUrl =
      `ws://${CONFIG.HOST}:${CONFIG.PORT}` +
      `${CONFIG.WS_PREFIX}/${callId}/${CONFIG.VOICE_DATA}/${CONFIG.LLM_URL}`;

    const ws = new WebSocket(wsUrl);
      const ttsActive = false;
      let ttsTimeout;
    let seq = 1;   // MUST be declared before passing to engine

    /**@type {ConversationReplayEngine| null} */
    let replayEngine= null;  // declare first

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
          },
          customParameters: {
            sttData: sttBase64
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
        logger.info({event: data.event}, 'messag eevent inside simulator')
        const data = JSON.parse(msg);
        logger.info(data.event)

        if(data.event== 'media'){
          ttsActive = true

          clearTimeout(ttsTimeout);
          ttsTimeout = setTimeout(()=>{
               if(ttsActive){
                ws.send(JSON.stringify({
          event: 'mark',
          sequenceNumber: seq++,
          mark : {
            name: `playback_complete_${this.current}`
          }
        }))
        ttsActive= false;
               }
          }, 200)
        }

        if (data.event === 'stop_tts') {
          replayEngine.handleTurnComplete();
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
