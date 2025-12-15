import { parentPort } from 'worker_threads';
import { PassThrough } from 'stream';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import alawmulaw from 'alawmulaw';
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { BlobServiceClient } from "@azure/storage-blob";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";


class RecordingWorker {
    constructor() {
        this.callerStream = new PassThrough();
        //this.agentStream = new PassThrough();
        this.isRecording = false;
        this.config = null;
        this.callId = null;
        this.s3Client = null;
        this.sampleRate = 8000;
        this.numChannels = 1;  // Mono for both streams
        this.callerAudioLength = 0;
        this.agentAudioLength = 0;
        this.azureContainerClient = null;

        this.setupMessageHandler();
    }

    setupMessageHandler() {
        parentPort.on('message', async (message) => {
            try {
                switch (message.type) {
                    case 'init':
                        this.initializeWorker(message.config);
                        break;
                    case 'start':
                        this.startRecording(message.callId);
                        break;
                    case 'callerAudio':
                        this.writeCallerAudio(message.chunk);
                        break;
                    case 'agentAudio':
                        this.writeCallerAudio(message.chunk);
                        break;
                    case 'stop':
                        await this.stopRecording();
                        break;
                }
            } catch (error) {
                console.error('Error in message handler:', error);
                parentPort.postMessage({
                    type: 'error',
                    error: error.message
                });
            }
        });
    }

    initializeWorker(config) {
        this.config = config;
        this.s3Client = new S3Client({
            region: config.aws.region
        });
        
        // Initialize Azure Blob Storage client using the connection string
        const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.connectionString);
        // Get the ContainerClient (ensure that your container exists; you might add logic here to create it if needed)
        this.azureContainerClient = blobServiceClient.getContainerClient(config.azure.containerName);

        parentPort.postMessage({ type: 'initialized' });
    }

    writeWavHeader(length = 0) {
        const buffer = Buffer.alloc(44);
        const outNumChannels = this.numChannels;
        const outSampleRate = this.sampleRate;
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;

        buffer.writeUInt32BE(1380533830, 0);                                      // RIFF identifier
        buffer.writeUInt32LE(36 + length, 4);                                     // file length
        buffer.writeUInt32BE(1463899717, 8);                                      // RIFF type 'WAVE'
        buffer.writeUInt32BE(1718449184, 12);                                     // format chunk identifier 'fmt '
        buffer.writeUInt32LE(16, 16);                                             // format chunk length
        buffer.writeUInt16LE(1, 20);                                              // sample format (raw)
        buffer.writeUInt16LE(outNumChannels, 22);                                 // channel count
        buffer.writeUInt32LE(outSampleRate, 24);                                  // sample rate
        buffer.writeUInt32LE(outSampleRate * bytesPerSample * outNumChannels, 28);// byte rate
        buffer.writeUInt16LE(bytesPerSample * outNumChannels, 32);                // block align
        buffer.writeUInt16LE(bitDepth, 34);                                       // bits per sample
        buffer.writeUInt32BE(1684108385, 36);                                     // data chunk identifier 'data'
        buffer.writeUInt32LE(length, 40);                                         // data length

        return buffer;
    }

    startRecording(callId) {
        this.isRecording = true;
        this.callId = callId;
        this.audioLength = 0;
        parentPort.postMessage({ type: 'recordingStarted', callId });
        console.log('Started recording for call:', callId);
    }


    writeCallerAudio(chunk) {
        if (!this.isRecording || !chunk) return;

        try {
            const muLawData = Buffer.from(chunk, 'base64');
            const pcmData = alawmulaw.mulaw.decode(new Uint8Array(muLawData));
            const pcmBuffer = Buffer.from(pcmData.buffer);

            this.callerStream.write(pcmBuffer);
            this.callerAudioLength += pcmBuffer.length;
        } catch (error) {
            console.error('Error processing caller audio:', error);
        }
    }

    // writeAgentAudio(chunk) {
    //     if (!this.isRecording || !chunk) return;

    //     try {
    //         const muLawData = Buffer.from(chunk, 'base64');
    //         const pcmData = alawmulaw.mulaw.decode(new Uint8Array(muLawData));
    //         const pcmBuffer = Buffer.from(pcmData.buffer);

    //         this.agentStream.write(pcmBuffer);
    //         this.agentAudioLength += pcmBuffer.length;
    //     } catch (error) {
    //         console.error('Error processing agent audio:', error);
    //     }
    // }

    async saveAudio() {
        const timestamp = Date.now();

        try {

            // Save to S3
            const callerFilename = `${this.callId}_caller_${timestamp}.wav`;
            console.log('saving to ' + callerFilename)
            //const agentFilename = `${this.callId}_agent_${timestamp}.wav`;

            await Promise.all([
                this.uploadStreamToS3(this.callerStream, callerFilename, this.callerAudioLength, 'caller'),
                //this.uploadStreamToS3(this.agentStream, agentFilename, this.agentAudioLength, 'agent')
            ]);

            parentPort.postMessage({
                type: 'saveComplete',
                callId: this.callId,
                callerFile: `s3://${this.config.aws.bucket}/${callerFilename}`,
                //agentFile: `s3://${this.config.aws.bucket}/${agentFilename}`
            });

        } catch (error) {
            console.error('Save error:', error);
            parentPort.postMessage({
                type: 'error',
                error: error.message,
                callId: this.callId
            });
            throw error;
        }
    }


    async saveStreamToFile(stream, filePath, audioLength, streamType) {
        return new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(filePath);
            const header = this.writeWavHeader(audioLength);
            fileStream.write(header);

            stream.pipe(fileStream);

            stream.on('end', () => {
                fileStream.end();
                console.log(`Saved ${streamType} file: ${filePath}, size: ${audioLength + 44} bytes`);
                resolve();
            });

            fileStream.on('error', (error) => {
                console.error(`File write error for ${streamType}:`, error);
                reject(error);
            });
        });
    }

    async stopRecording() {
        if (!this.isRecording) return;
        try {
            console.log('Recording stopped')
            this.isRecording = false;
            this.callerStream.end();
            //this.agentStream.end();
            //await this.testS3Connection(); commented due to azure -- temporary
            //await this.saveAudio(); //commented due to azure -- temporary
            //await this.saveToLocal();

            parentPort.postMessage({
                type: 'recordingStopped',
                callId: this.callId
            });
        } catch (error) {
            parentPort.postMessage({
                type: 'error',
                error: error.message,
                callId: this.callId
            });
        }
    }



    async uploadStreamToS3(stream, filename, audioLength, streamType) {
        return new Promise((resolve, reject) => {
            const passThroughStream = new PassThrough();
            const header = this.writeWavHeader(audioLength);
            passThroughStream.write(header);
            stream.pipe(passThroughStream);

            const uploadParams = {
                Bucket: this.config.s3.audioBucket,
                Key: filename,
                Body: passThroughStream,
                ContentType: 'audio/wav'
            };

            const uploader = new Upload({
                client: this.s3Client,
                params: uploadParams,
                leavePartsOnError: false

            });

            uploader.on('httpUploadProgress', (progress) => {
                console.log(`${streamType} upload progress:`, progress);
            });

            uploader.done()
                .then(() => {
                    console.log(`Uploaded ${streamType} file to S3: ${filename}`);
                    resolve();
                })
                .catch((error) => {
                    console.error(`S3 upload error for ${streamType}:`, error);
                    reject(error);
                });
        });
    }


    async uploadStreamToAzure(stream, filename, audioLength, streamType) {
        return new Promise((resolve, reject) => {
            // Create a new PassThrough stream to prepend the WAV header
            const passThroughStream = new PassThrough();
            const header = this.writeWavHeader(audioLength);
            passThroughStream.write(header);
            stream.pipe(passThroughStream);

            // Create a blob client using the container client from your config
            const containerClient = this.azureContainerClient; // Assuming it is set in initializeWorker
            const blockBlobClient = containerClient.getBlockBlobClient(filename);

            // Use the uploadStream method from @azure/storage-blob
            blockBlobClient.uploadStream(
                passThroughStream,
                4 * 1024 * 1024, // Block size (e.g., 4 MB)
                20,              // Max concurrency of 20 (adjust as needed)
                { blobHTTPHeaders: { blobContentType: "audio/wav" } }
            )
                .then((uploadResponse) => {
                    console.log(`Uploaded ${streamType} file to Azure: ${filename}`);
                    resolve();
                })
                .catch((error) => {
                    console.error(`Azure upload error for ${streamType}:`, error);
                    reject(error);
                });
        });
    }



    async saveToLocal() {
        const timestamp = Date.now();
        const recordingsDir = './recordings';

        try {
            if (!fs.existsSync(recordingsDir)) {
                fs.mkdirSync(recordingsDir, { recursive: true });
            }

            // Save caller audio
            const callerFilename = `${this.callId}_caller_${timestamp}.wav`;
            const callerPath = path.join(recordingsDir, callerFilename);
            await this.saveStreamToFile(this.callerStream, callerPath, this.callerAudioLength, 'caller');

            // Save agent audio
            //const agentFilename = `${this.callId}_agent_${timestamp}.wav`;
            //const agentPath = path.join(recordingsDir, agentFilename);
            // await this.saveStreamToFile(this.agentStream, agentPath, this.agentAudioLength, 'agent');

            parentPort.postMessage({
                type: 'saveComplete',
                callId: this.callId,
                callerFile: callerPath,
                //agentFile: agentPath
            });

        } catch (error) {
            console.error('Local save error:', error);
            parentPort.postMessage({
                type: 'error',
                error: error.message,
                callId: this.callId
            });
            throw error;
        }
    }


    async testS3Connection() {
        try {
            // Try to list buckets as a simple test
            const testParams = {
                Bucket: this.config.s3.audioBucket,
                MaxKeys: 1
            };

            await this.s3Client.send(new ListObjectsV2Command(testParams));
            console.log('S3 connection test successful');
        } catch (error) {
            console.error('S3 connection test failed:', error);
            throw error;
        }
    }


}

new RecordingWorker();