// audioStreamerWorker.js
import { workerData, parentPort } from 'worker_threads';
import fs from 'fs/promises';

// Extract configuration from workerData
const {
  audioFilePath,
  streamSid,
  sampleRate,
  chunkSize,
  chunkIntervalMs
} = workerData;

// Worker state
let running = true;
let buffer = null;
let position = 0;
let sendInterval = null;

// Log function that sends logs to the main thread
const log = (message) => {
  parentPort.postMessage({ type: 'log', data: message });
};

// Error function that sends errors to the main thread
const error = (message) => {
  parentPort.postMessage({ type: 'error', data: message });
};

// Load the entire audio file into memory
const preloadAudio = async () => {
  try {
    buffer = await fs.readFile(audioFilePath);
    log(`Preloaded ${buffer.length} bytes of audio data`);
    return true;
  } catch (err) {
    error(`Failed to preload audio: ${err.message}`);
    return false;
  }
};

// Send a chunk of audio data to the main thread
const sendChunk = (chunk) => {
  if (!running) return;

  try {
    // Create the message for Twilio
    const message = {
      event: 'media',
      streamSid,
      media: { payload: chunk.toString('base64') }
    };

    // Send the serialized message to the main thread
    parentPort.postMessage({
      type: 'audio_chunk',
      data: JSON.stringify(message)
    });
  } catch (err) {
    error(`Error sending chunk: ${err.message}`);
    stop();
  }
};

// Stop streaming audio
const stop = () => {
  running = false;

  if (sendInterval) {
    clearInterval(sendInterval);
    sendInterval = null;
  }

  log('Audio streaming stopped.');
};

// Start streaming audio
const start = async () => {
  if (!buffer) {
    const success = await preloadAudio();
    if (!success) return;
  }

  if (position >= buffer.length) { position = 0; }



  sendInterval = setInterval(() => {
    if (!running) {
      //position=0;
      //stop();
      return;
    }

    // Get next chunk
    const end = Math.min(position + chunkSize, buffer.length);
    const chunk = buffer.subarray(position, end);
    position = end;

    // Send chunk
    sendChunk(chunk);

    // Check if we reached the end
    if (position >= buffer.length) {
      log('End of buffer reached.');
      position=0;
     // parentPort.postMessage({ type: 'done' });
     // stop();
    }
  }, chunkIntervalMs);
};

// Handle messages from the main thread
parentPort.on('message', (message) => {
  if (message.command === 'stop') {
    stop();
  }
});

// Start the streaming process
start();

// Clean up when the worker is terminated
process.on('exit', () => {
  stop();
  buffer = null;
});