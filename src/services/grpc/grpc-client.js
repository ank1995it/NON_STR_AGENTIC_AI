import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load Proto Definition
const PROTO_PATH = path.resolve(__dirname, 'audio_stream.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const client = new protoDescriptor.AudioStreamService('localhost:50051', grpc.credentials.createInsecure());

export class CallStreamManager {
    constructor(callSid, logger ,streamSid) {
        this.callSid = callSid;
        this.streamSid = streamSid;
        this.logger= logger
        this.call = null; // The gRPC call object
        this.isClosed = false;

        this.initStream();
    }

    initStream() {
        this.logger.info("Initializing gRPC Stream")

        // 1. Start the Client Stream
        // The callback function handles the FINAL response from the server (ProcessingResponse)
        this.call = client.StreamAudio((error, response) => {
            if (error) {
                console.error(`[${this.callSid}] ❌ gRPC Error:`, error.message);
            } else {
                console.log(`[${this.callSid}] ✅ Stream Complete. Frames: ${response.frames_processed}`);
            }
        });
    }

    sendAudioChunk(payloadBase64) {
        if (this.isClosed || !this.call) return;

        try {
            // Convert base64 to Buffer
            const buffer = Buffer.from(payloadBase64, 'base64');

            // 2. Write to the gRPC Stream
            this.call.write({
                audio_data: buffer,
                stream_id: this.streamSid,
                timestamp: Date.now(),
                call_id: this.callSid
            });
        } catch (err) {
            this.logger.error(err)
        }
    }

    close() {
        if (this.isClosed) return;
        this.isClosed = true;

        if (this.call) {
            this.logger.info(`Closing Stream`);
            this.call.end(); // Signal server that stream is done
        }
    }
}

 