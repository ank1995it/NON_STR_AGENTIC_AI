37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /media-stream/sim-1770896694695/en-US/undefined
37|dev-voice-17070  | [11:44:54.718] Stream started with SID: stream-sim-1770896694695
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:44:54 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '169',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=%23%23%23%23%23%23%23%23%23%23&callid=sim-1770896694695&interrupt
ed=false&silence=false'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm {
37|dev-voice-17070  |   assistant: 'Welcome to Latitude Financial Services. Calls may be recorded for quality and record-keeping purpos
es. This is Alex, how can I help you?',
37|dev-voice-17070  |   cut_call: false
37|dev-voice-17070  | }
37|dev-voice-17070  | tts payload {"assistant":"Welcome to Latitude Financial Services. Calls may be recorded for quality and record-ke
eping purposes. This is Alex, how can I help you?"}
37|dev-voice-17070  | [11:44:54.887] TTS started
37|dev-voice-17070  | [2026-02-12 11:44:54.711 +0000] INFO: llm url
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     llmUrl: "undefined"
37|dev-voice-17070  |     voiceData: "en-US"
37|dev-voice-17070  | [2026-02-12 11:44:54.711 +0000] INFO: undefined
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.711 +0000] INFO: New WebSocket connection established
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.711 +0000] INFO: WebSocket parameters
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.711 +0000] ERROR: true
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.712 +0000] INFO: z 
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.712 +0000] INFO: Decoded LLM Data: 
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     decodedLlmUrl: " w^~) "
37|dev-voice-17070  | [2026-02-12 11:44:54.712 +0000] WARN: Unknown TTS provider: elevenlabs, defaulting to Eleven Labs
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.712 +0000] INFO: New Object TTS
37|dev-voice-17070  | [2026-02-12 11:44:54.713 +0000] INFO: SpeechManager initialized
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "SpeechManager"
37|dev-voice-17070  | [2026-02-12 11:44:54.713 +0000] INFO: [11:44:54.713] Setting up WebSocket event handlers
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.713 +0000] INFO: Initializing gRPC Stream
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.716 +0000] INFO: Silence detector initialized
37|dev-voice-17070  | [2026-02-12 11:44:54.716 +0000] INFO: WebSocketHandler initialized
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.716 +0000] INFO: [11:44:54.716] WebSocket handler setup complete
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.717 +0000] INFO: inside hanlde start
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.717 +0000] INFO: {"event":"start","sequenceNumber":1,"start":{"callSid":"sim-1770896694695",
"streamSid":"stream-sim-1770896694695","mediaFormat":{"encoding":"audio/x-mulaw","sampleRate":8000,"channels":1},"customParameters":{"s
ttData":"eyJsb2NhbGUiOiJlbi1VUyJ9"}}}
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.718 +0000] INFO: ===================Initiating Conversation=========================
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.718 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: "##########"
37|dev-voice-17070  | [2026-02-12 11:44:54.718 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: " w^~) "
37|dev-voice-17070  | [2026-02-12 11:44:54.718 +0000] INFO: sent interruption as false on utterance ##########
37|dev-voice-17070  | [2026-02-12 11:44:54.719 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=%23%23%23%23%23%23%23%23%23%23&callid=sim-1770896694695&interru
pted=false&silence=false"
37|dev-voice-17070  | [2026-02-12 11:44:54.723 +0000] INFO: Silence detection started
37|dev-voice-17070  | [2026-02-12 11:44:54.724 +0000] INFO: STT Data decoded
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.724 +0000] INFO:
37|dev-voice-17070  |     0: "audioTransformer"
37|dev-voice-17070  |     1: "transcribeService"
37|dev-voice-17070  |     2: "ttsService"
37|dev-voice-17070  |     3: "responseService"
37|dev-voice-17070  |     4: "cleanup"
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.724 +0000] INFO: create readable stream
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "AudioTransformer"
37|dev-voice-17070  | [2026-02-12 11:44:54.724 +0000] INFO: startStream service started
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:44:54.724 +0000] INFO: Initializing Azure Speech client
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:44:54.724 +0000] INFO: STT Data received:
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:44:54.726 +0000] INFO: Azure Speech recognition started
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:44:54.881 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:44:54.886 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": "Welcome to Latitude Financial Services. Calls may be recorded for quality and record-keeping 
purposes. This is Alex, how can I help you?",
37|dev-voice-17070  |       "cut_call": false
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:44:54.887 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 168.212647
37|dev-voice-17070  |     sessionId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:44:54.887 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:44:54.887 +0000] INFO: Starting TTS generation
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     response: "Welcome to Latitude Financial Services. Calls may be recorded for quality and record-keeping purpo
ses. This is Alex, how can I help you?"
37|dev-voice-17070  | [2026-02-12 11:44:54.887 +0000] INFO: {"assistant":"Welcome to Latitude Financial Services. Calls may be recorded
 for quality and record-keeping purposes. This is Alex, how can I help you?"}
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     ttsPayload: "{\"assistant\":\"Welcome to Latitude Financial Services. Calls may be recorded for quality and r
ecord-keeping purposes. This is Alex, how can I help you?\"}"
37|dev-voice-17070  | [2026-02-12 11:44:54.889 +0000] INFO: Starting ElevenLabs TTS synthesis
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     textLength: 152
37|dev-voice-17070  | [2026-02-12 11:44:54.889 +0000] INFO:
37|dev-voice-17070  |     _options: {
37|dev-voice-17070  |       "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:44:54.889 +0000] INFO: OYTbf65OHHFELVut7v2H
37|dev-voice-17070  | [2026-02-12 11:44:54.889 +0000] INFO: eleven_flash_v2_5
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [2026-02-12 11:45:04.476 +0000] INFO: SPEECH START DETECTED
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "sim-1770896694695"
37|dev-voice-17070  | [11:45:04.584] Sending stop TTS signal
37|dev-voice-17070  | [2026-02-12 11:45:04.583 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "sim-1770896694695"
37|dev-voice-17070  |     text: "hi my name is an"
37|dev-voice-17070  | [2026-02-12 11:45:04.583 +0000] INFO: Background Audio Streamer Started
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:45:04.584 +0000] INFO: Speech detected during TTS
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:45:04.584 +0000] INFO: TTS stopped
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "SpeechManager"
37|dev-voice-17070  |     interrupted: false
37|dev-voice-17070  | [2026-02-12 11:45:04.584 +0000] INFO: sending stop tts signal
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:45:04.584 +0000] INFO: 127.0.0.1
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:45:04.584 +0000] INFO: Sent clear event due to speech detection
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [AudioStreamer Worker] Preloaded 176283 bytes of audio data
37|dev-voice-17070  | [2026-02-12 11:45:04.681 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "sim-1770896694695"
37|dev-voice-17070  |     text: "hi my name is ankit naughtyyal"
37|dev-voice-17070  | [11:45:04.873] Final transcript: "Hi my name is Ankit Notyal."
37|dev-voice-17070  | [11:45:04.873] Processing transcript: "Hi my name is Ankit Notyal."
37|dev-voice-17070  | [2026-02-12 11:45:04.873 +0000] INFO: SPEECH PROCESS [LATENCY], DURATION MS: 192.21
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:45:04.873 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: "Hi my name is Ankit Notyal."
37|dev-voice-17070  | [2026-02-12 11:45:04.873 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: " w^~) "
37|dev-voice-17070  | [2026-02-12 11:45:04.873 +0000] INFO: sent interruption as true on utterance Hi my name is Ankit Notyal.
37|dev-voice-17070  | [2026-02-12 11:45:04.873 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=Hi+my+name+is+Ankit+Notyal.&callid=sim-1770896694695&interrupte
d=true&silence=false"
37|dev-voice-17070  | Audio streaming already running.
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:45:04 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '33',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=Hi+my+name+is+Ankit+Notyal.&callid=sim-1770896694695&interrupted=
true&silence=false'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm { assistant: '', cut_call: false }
37|dev-voice-17070  | Audio streaming stopped.
37|dev-voice-17070  | [AudioStreamer Worker] Audio streaming stopped.
37|dev-voice-17070  | Audio streamer worker stopped with exit code 1
37|dev-voice-17070  | [2026-02-12 11:45:05.552 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "sim-1770896694695"
37|dev-voice-17070  |     text: "yes please"
37|dev-voice-17070  | [2026-02-12 11:45:05.553 +0000] INFO: Background Audio Streamer Started
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:45:05.878 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:45:05.879 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": "",
37|dev-voice-17070  |       "cut_call": false
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:45:05.879 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 1005.833876
37|dev-voice-17070  |     sessionId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:45:05.880 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [11:45:06.280] Final transcript: "Yes, please."
37|dev-voice-17070  | [11:45:06.280] Processing transcript: "Yes, please."
37|dev-voice-17070  | [2026-02-12 11:45:06.280 +0000] INFO: SPEECH PROCESS [LATENCY], DURATION MS: 727.87
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:45:06.281 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: "Yes, please."
37|dev-voice-17070  | [2026-02-12 11:45:06.281 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: " w^~) "
37|dev-voice-17070  | [2026-02-12 11:45:06.281 +0000] INFO: sent interruption as false on utterance Yes, please.
37|dev-voice-17070  | [2026-02-12 11:45:06.281 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=Yes%2C+please.&callid=sim-1770896694695&interrupted=false&silen
ce=false"
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:45:05 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '58',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=Yes%2C+please.&callid=sim-1770896694695&interrupted=false&silence
=false'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm { assistant: 'Hi, how can I help you",', cut_call: false }
37|dev-voice-17070  | tts payload {"assistant":"Hi, how can I help you\","}
37|dev-voice-17070  | [11:45:07.310] TTS started
37|dev-voice-17070  | [2026-02-12 11:45:07.309 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:45:07.309 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": "Hi, how can I help you\",",
37|dev-voice-17070  |       "cut_call": false
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:45:07.309 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 1028.781343
37|dev-voice-17070  |     sessionId: "sim-1770896694695"
37|dev-voice-17070  | [2026-02-12 11:45:07.309 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:45:07.309 +0000] INFO: Starting TTS generation
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     response: "Hi, how can I help you\","
37|dev-voice-17070  | [2026-02-12 11:45:07.310 +0000] INFO: {"assistant":"Hi, how can I help you\","}
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     ttsPayload: "{\"assistant\":\"Hi, how can I help you\\",\"}"
37|dev-voice-17070  | [2026-02-12 11:45:07.310 +0000] INFO: Starting ElevenLabs TTS synthesis
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     textLength: 41
37|dev-voice-17070  | [2026-02-12 11:45:07.310 +0000] INFO:
37|dev-voice-17070  |     _options: {
37|dev-voice-17070  |       "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |     }
37|dev-voice-17070  |     _textToSpeech: {
37|dev-voice-17070  |       "_options": {
37|dev-voice-17070  |         "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |       }
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:45:07.310 +0000] INFO: OYTbf65OHHFELVut7v2H
37|dev-voice-17070  | [2026-02-12 11:45:07.310 +0000] INFO: eleven_flash_v2_5
