import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Readable } from 'stream';

export class TranscribeClient {
    constructor(config , logger) {
        this.config = config;
        this.speechConfig = null;
        this.recognizer = null;
        this.pushStream = null;
        this.isInitialized = false;
        this.logger = logger
    }

    // Create a silent buffer for cold start
    createSilentBuffer(durationMs) {
        const sampleRate = this.config.audio.sampleRate;
        const bytesPerSample = 2; // 16-bit PCM
        const channels = 1; // Mono
        const numSamples = Math.floor(sampleRate * durationMs / 1000);
        const bufferSize = numSamples * bytesPerSample * channels;
        
        // Create a buffer filled with zeros (silence)
        return Buffer.alloc(bufferSize, 0);
    }

    // Initialize the speech client with a silent buffer
    async coldStart() {
        try {
            this.logger.info('Cold starting Azure Speech client');
            
            // Create a silent buffer (500ms of silence)
            const silentBuffer = this.createSilentBuffer(500);
            
            // Create a readable stream from the silent buffer
            const silentStream = new Readable({
                read() {
                    this.push(silentBuffer);
                    this.push(null); // Signal end of stream
                }
            });
            
            // Start the recognition with the silent buffer
            const recognizer = await this.startStream(silentStream);
            
            // Set up a listener for the silent buffer processing
            return new Promise((resolve, reject) => {
                recognizer.recognized = (_, event) => {
                    this.logger.info('Cold start complete, client ready');
                    this.isInitialized = true;
                    resolve();
                };
                
                // Set a timeout in case the recognition doesn't complete
                setTimeout(() => {
                    if (!this.isInitialized) {
                        this.logger.info('Cold start timeout, but client should be ready');
                        this.isInitialized = true;
                        resolve();
                    }
                }, 3000);
            });
        } catch (error) {
            this.logger.error({error},'Failed during cold start:');
            throw error;
        }
    }

    async startStream(audioStream,sttData) {
        try {
            this.logger.info('Initializing Azure Speech client');
            this.logger.info('STT Data received:', sttData);
            // Create and configure speech config
            this.speechConfig = sdk.SpeechConfig.fromEndpoint(
                new URL(this.config.azure.speechSTTEndpoint),
                this.config.azure.speechKey
                //this.config.azure.speechRegion   
        
            );
            

            // Set recognition language
            //this.speechConfig.speechRecognitionLanguage = this.config.azure.language;

           // Configure timeouts and properties
           
            // this.speechConfig.setProperty(
            //     sdk.PropertyId.Speech_SegmentationStrategy,
            //     'Semantic'
            // );

            this.speechConfig.setProperty(
                sdk.PropertyId.SpeechServiceConnection_EnableAudioLogging,
                'true'
            );

            this.speechConfig.setProperty(
                sdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguages,
                sttData.locale
            );

             this.speechConfig.setProperty(
                sdk.PropertyId.SpeechServiceConnection_LanguageIdMode,
                'Continuous'
            );

            // this.speechConfig.setProperty(
            //     sdk.PropertyId.SpeechServiceConnection_RecoMode,
            //     'INTERACTIVE'
            // );
            
            this.speechConfig.setProperty(
                sdk.PropertyId.Speech_SegmentationSilenceTimeoutMs,
                String(1000)
            );    

             this.speechConfig.setProperty(
                sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
                 "15000"
                    );    
           // this.speechConfig.setProperty(sdk.PropertyId.Speech_StartEventSensitivity, "Medium");            

             // This property has been deprecated       
            // this.speechConfig.setProperty(
            //     sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
            //      String(5000)  
            // );

            this.speechConfig.setProperty(
                "SpeechServiceResponse_StablePartialResultThreshold",
                    "0"
                 );
                 
            // Create push stream for audio
            this.pushStream = sdk.AudioInputStream.createPushStream(
                sdk.AudioStreamFormat.getWaveFormatPCM(
                    this.config.audio.sampleRate,
                    16,  // 16-bit PCM
                    1    // Mono channel
                )
            );

            // Create audio config
            const audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);

            // Create recognizer
            this.recognizer = new sdk.SpeechRecognizer(this.speechConfig, audioConfig);

            // Set up audio stream handling
            audioStream.on('data', (chunk) => {
                if (this.pushStream) {
                    this.pushStream.write(chunk);
                }
            });

            audioStream.on('end', () => {
                if (this.pushStream) {
                    this.pushStream.close();
                }
                this.cleanup()
            });

            audioStream.on('error', (error) => {
                this.logger.error({error},'Audio stream error:');
                this.cleanup();
            });

            // Start continuous recognition
            await this.recognizer.startContinuousRecognitionAsync();
            this.logger.info('Azure Speech recognition started');

            return this.recognizer;

        } catch (error) {
            this.logger.error({error},'Failed to start speech recognition:');
            await this.cleanup();
            throw error;
        }
    }

    async cleanup() {
        try {
            if (this.recognizer) {
                await this.recognizer.stopContinuousRecognitionAsync();
                this.recognizer.close();
                this.recognizer = null;
            }

            if (this.pushStream) {
                this.pushStream.close();
                this.pushStream = null;
            }

            this.speechConfig = null;
            this.logger.info('Azure Speech client cleaned up');
        } catch (error) {
            this.logger.error({error}, 'Error during cleanup:');
        }
    }
}
