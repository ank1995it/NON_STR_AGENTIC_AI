import fs from 'fs';
import path from 'path';

export class TwilioAudioStreamer {
  /**
   * Creates a new audio streamer.
   * @param {WebSocket} connection - The active Twilio WebSocket connection.
   * @param {string} streamSid - The unique stream SID provided by Twilio.
   * @param {string} [audioFilePath='./output.ulaw'] - Path to the local audio file (must be in mulaw/8000 format).
   * @param {number} [sampleRate=8000] - The sample rate in Hz.
   */
  constructor(connection, streamSid, audioFilePath = './output.ulaw', sampleRate = 8000) {
    this.connection = connection;
    this.streamSid = streamSid;
    this.audioFilePath = path.resolve(audioFilePath);
    this.sampleRate = sampleRate;
    this._running = false;
    this._readStream = null;
  }

  /**
   * Starts streaming audio data in a loop.
   * If already running, does nothing.
   */
  async start() {
    if (this._running) {
      console.log('Audio streaming already running.');
      return;
    }
    this._running = true;
    this._readStream = fs.createReadStream(this.audioFilePath, {
      highWaterMark: 80, // chunk size in bytes; adjust as needed
    });

    try {
      while (this._running) {
        // Attempt to read a chunk immediately.
        let chunk = this._readStream.read();

        // If no chunk is available, wait for the 'readable' event.
        if (chunk === null) {
          chunk = await new Promise((resolve, reject) => {
            const onReadable = () => {
              cleanup();
              resolve(this._readStream.read());
            };

            const onEnd = () => {
              cleanup();
              resolve(null);
            };

            const onError = (error) => {
              cleanup();
              reject(error);
            };

            const cleanup = () => {
              this._readStream.removeListener('readable', onReadable);
              this._readStream.removeListener('end', onEnd);
              this._readStream.removeListener('error', onError);
            };

            this._readStream.once('readable', onReadable);
            this._readStream.once('end', onEnd);
            this._readStream.once('error', onError);
          });
        }

        // If the stream ended, break the loop.
        if (chunk === null) {
          console.log('End of stream reached.');
          break;
        }

        // Check if streaming has been stopped in the meantime.
        if (!this._running) break;

        // Process the chunk.
        const base64Payload = chunk.toString('base64');
        const message = {
          event: 'media',
          streamSid: this.streamSid,
          media: { payload: base64Payload },
        };
        this.connection.send(JSON.stringify(message));

        // Delay to simulate real-time transmission (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, 13));
      }
    } catch (error) {
      console.error('Error while streaming:', error);
    } finally {
      this._running = false;
      this._cleanupStream();
      console.log('Streaming loop exited.');
    }
  }

  /**
   * Stops streaming audio data by setting the running flag to false and cleaning up the stream.
   */
  async stop() {
    if (!this._running) {
      console.log('Audio streaming is not running.');
      return;
    }
    this._running = false;
    this._cleanupStream();
    console.log('Audio streaming stopped.');
  }

  /**
   * Cleanup the read stream.
   */
  _cleanupStream() {
    if (this._readStream) {
      this._readStream.destroy();
      this._readStream = null;
    }
  }
}
