// main.js - Your main application file
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TwilioAudioStreamer {
  /**
   * Creates a new audio streamer that works in a separate thread.
   * @param {WebSocket} connection - The active Twilio WebSocket connection.
   * @param {string} streamSid - The unique stream SID provided by Twilio.
   * @param {string} [audioFilePath='./output.ulaw'] - Path to the local audio file.
   * @param {number} [sampleRate=8000] - The sample rate in Hz.
   * @param {number} [chunkSize=160] - Size of each audio chunk in bytes.
   */
  constructor(markQueue,connection, streamSid, audioFilePath = './output.ulaw', sampleRate = 8000, chunkSize = 160) {
    this.markQueue=markQueue;
    this.connection = connection;
    this.streamSid = streamSid;
    this.audioFilePath = path.resolve(audioFilePath);
    this.sampleRate = sampleRate;
    this.chunkSize = chunkSize;
    this.worker = null;
    this._running = false;
    
    // Set up connection message handler to forward WebSocket ready state
    this.connection.addEventListener('close', () => {
      this.stop();
    });
  }

  /**
   * Starts streaming audio data in a separate thread.
   * @param {number} [chunkIntervalMs=10] - Interval between chunks in milliseconds.
   * @returns {Promise<void>}
   */
  async start(chunkIntervalMs = 10) {
    if (this._running) {
      console.log('Audio streaming already running.');
      return;
    }
    
    this._running = true;
    
    // Create a new worker thread
    this.worker = new Worker(path.resolve(__dirname, './audio-stream-worker.js'), {
      workerData: {
        audioFilePath: this.audioFilePath,
        streamSid: this.streamSid,
        sampleRate: this.sampleRate,
        chunkSize: this.chunkSize,
        chunkIntervalMs
      }
    });
    
    // Set up message handling from worker
    this.worker.on('message', (message) => {
      if (message.type === 'audio_chunk') {
        // Forward the audio chunk to the WebSocket if it's open
        if (this.connection.readyState === 1) {
          this.connection.send(message.data);
          const markEvent = {
            event: 'mark',
            streamSid: this.streamSid,
            mark: { name: 'responsePartAudio' }
        };
        this.connection.send(JSON.stringify(markEvent));
        }
      } else if (message.type === 'log') {
        console.log(`[AudioStreamer Worker] ${message.data}`);
      } else if (message.type === 'error') {
        console.error(`[AudioStreamer Worker] ${message.data}`);
      } else if (message.type === 'done') {
        this.stop();
      }
    });
    
    // Handle worker errors
    this.worker.on('error', (error) => {
      console.error('Audio streamer worker error:', error);
      this.stop();
    });
    
    // Handle worker exit
    this.worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Audio streamer worker stopped with exit code ${code}`);
      }
      this.worker = null;
      this._running = false;
    });
  }

  /**
   * Stops streaming audio data by terminating the worker thread.
   */
  stop() {
    if (!this._running) {
      return;
    }
    
    this._running = false;
    this.connection.send(JSON.stringify({
      event: 'clear',
      streamSid: this.streamSid
  }));
    
    if (this.worker) {
      // Send stop message to worker
      this.worker.postMessage({ command: 'stop' });
      
      // Give worker a chance to clean up, then terminate if needed
      setTimeout(() => {
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }
      }, 100);
    }
    
    console.log('Audio streaming stopped.');
  }
}