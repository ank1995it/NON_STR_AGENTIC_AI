// src/config/index.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    redis:{
        hostName: process.env.REDIS_HOSTNAME || 'agai-tenants-cache.redis.cache.windows.net',
        port: parseInt(process.env.REDIS_PORT || '6380'),
        password: process.env.REDIS_ACCESS_KEY 
    },
    SNS:{
       region : "ap-south-1"
    },
    silence: {
        enabled: true,
        warningIntervals: [5000, 10000, 15000, 20000],
        messages: {
          warning1: process.env.SILENCE_WARNING_1 || "Are you there?",
          warning2: process.env.SILENCE_WARNING_2 || "Hello, are you still on the line?",
          warning3: process.env.SILENCE_WARNING_3 || "Please respond if you can hear me.",
          disconnect: process.env.SILENCE_DISCONNECT_MSG || "As we haven't received any response, we'll be disconnecting this call. Thank you."
        }
      },
    s3: {
        audioBucket: process.env.S3_AUDIO_BUCKET || 'call-recordings-twilio-moonis',
        region: process.env.AWS_REGION || 'us-east-1',
        uploadTimeout: parseInt(process.env.S3_UPLOAD_TIMEOUT || '7200000'), // 2 hours
        partSize: parseInt(process.env.S3_PART_SIZE || '5242880') // 5MB
    },
    dynamodb: {
        tableName: process.env.DYNAMODB_TABLE_NAME || 'voice-assistant-transcription',
        ttl: 30 * 24 * 60 * 60, // 30 days retention
        enableStreaming: false,
         
    },    
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        maxRetries: 3,
        timeout: 5000
    },
    azure: {
        connectionString: process.env.connectionString ,
        queueName: process.env.queueName || 'transcripteventqueue',
        speechKey: process.env.AZURE_SPEECH_KEY,
        speechEndpoint: process.env.AZURE_SPEECH_ENDPOINT || "ai-agent-voice.cognitiveservices.azure.com",
        speechSTTEndpoint: process.env.AZURE_SPEECH_STT_ENDPOINT || "wss://ai-agent-voice.cognitiveservices.azure.com/stt/speech/recognition/conversation/cognitiveservices/v1",    
        speechRegion: process.env.AZURE_SPEECH_REGION || 'eastus',
        language: process.env.AZURE_SPEECH_LANGUAGE || 'en-US',
        maxRetries: parseInt(process.env.AZURE_MAX_RETRIES || '3'),
        timeoutMs: parseInt(process.env.AZURE_TIMEOUT_MS || '5000'),
        endSilenceTimeoutMs: parseInt(process.env.AZURE_END_SILENCE_TIMEOUT_MS || '1000'),
        initialSilenceTimeoutMs: parseInt(process.env.AZURE_INITIAL_SILENCE_TIMEOUT_MS || '5000'),
        tts: {
        host: process.env.AZURE_TTS_HOST || "agenticaiva-dev-speechservice.cognitiveservices.azure.com",
        path: process.env.AZURE_TTS_PATH || "/tts/cognitiveservices/v1",
        outputFormat: process.env.AZURE_TTS_OUTPUT_FORMAT || "audio-16khz-128kbitrate-mono-mp3",
        userAgent: process.env.AZURE_TTS_USER_AGENT || "NodeApp/1.0",
        blobConnectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
        blobContainerName: process.env.AZURE_BLOB_CONTAINER_NAME || 'agentic-voice-recordings'
    },
    },
    elevenlabs:{
        apiKey: process.env.ELEVENLABS_APIKEY,
        voiceId: process.env.VOICE_ID,
        modelId: process.env.MODEL_ID || 'eleven_flash_v2'

    },
    deepgram:{
        apiKey: process.env.DEEPGRAM_APIKEY,
        voiceId: process.env.DEEPGRAM_VOICE_ID,
        modelId: process.env.DEEPGRAM_MODEL_ID || 'eleven_flash_v2'

    },
    server: {
        port: parseInt(process.env.PORT || '5050'),
        host: '0.0.0.0',
        trustProxy: true,
        connectionTimeout: 30000
    },
    audio: {
        sampleRate: 8000,
        encoding: 'pcm',
        chunkSize: 320
    },
    tts: {
        provider: process.env.TTS_PROVIDER || 'polly',
        voiceId: process.env.AWS_VOICE_ID || 'Ruth',
        azureVoiceId: process.env.AZURE_VOICE_ID || 'en-US-Davis:DragonHDLatestNeural',
        cacheEnabled: false,
        cacheTTL: 3600 // 1 hour
    },
    response: {
        type: process.env.RESPONSE_GENERATOR || 'basic', // 'basic' or 'groq',
        llmQueryURL: process.env.LLM_QUERY_ENDPOINT || 'http://localhost:5000/query',
    },
    externalApiCalls: {
        postCallSumaaryURL: process.env.POST_CALL_SUMMARY_ENDPOINT || 'http://localhost:5000/call_summary',
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        recordCalls:process.env.RECORD || 'false',
        twimlBinUrl: process.env.TWIML_BIN_URL || 'https://handler.twilio.com/twiml/EHdcc107a7f4058113d165d23e00700f9d',
        recordingStatusCallbackUrl: process.env.RECORDING_STATUS_CALLBACK_URL || 'https://agaidev.exlservice.com/recording-status'
    },
    security: {
        maxPayloadSize: 5 * 1024 * 1024, // 5MB
        rateLimit: {
            enabled: true,
            windowMs: 60 * 1000, // 1 minute
            max: 100 // requests per windowMs
        }
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        prettyPrint: true,//process.env.NODE_ENV !== 'production'
    },
    groq: {
        enabled: process.env.GROQ_ENABLED === 'true',
        apiKey: process.env.GROQ_API_KEY,
        model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
        maxTokens: parseInt(process.env.GROQ_MAX_TOKENS || '100'),
        temperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.7'),
        fallbackEnabled: true
    },
    topics:{// this topic should be replaced by actual AWS ARN
        CALL_EVENTS : "voice-call-events",
        CALL_TRANSCRIPTS: "voice-call-transcripts",
        POST_CALL : "voice-call-postprocessing"
    }
};
