[2026-02-12 11:48:25.521 +0000] INFO: Calls status received
37|dev-voice-17070  |     body: {
37|dev-voice-17070  |       "Called": "+917055140772",
37|dev-voice-17070  |       "ToState": "",
37|dev-voice-17070  |       "CallerCountry": "US",
37|dev-voice-17070  |       "Direction": "outbound-api",
37|dev-voice-17070  |       "Timestamp": "Thu, 12 Feb 2026 11:48:25 +0000",
37|dev-voice-17070  |       "CallbackSource": "call-progress-events",
37|dev-voice-17070  |       "CallerState": "",
37|dev-voice-17070  |       "ToZip": "",
37|dev-voice-17070  |       "SequenceNumber": "0",
37|dev-voice-17070  |       "CallSid": "CA1a82a67c48866944486ea46ff1dce023",
37|dev-voice-17070  |       "To": "+917055140772",
37|dev-voice-17070  |       "CallerZip": "",
37|dev-voice-17070  |       "ToCountry": "IN",
37|dev-voice-17070  |       "CalledZip": "",
37|dev-voice-17070  |       "ApiVersion": "2010-04-01",
37|dev-voice-17070  |       "CalledCity": "",
37|dev-voice-17070  |       "CallStatus": "initiated",
37|dev-voice-17070  |       "From": "+18885891791",
37|dev-voice-17070  |       "AccountSid": "ACe25e10d0db6a5f5823512c2ecc33e8f4",
37|dev-voice-17070  |       "CalledCountry": "IN",
37|dev-voice-17070  |       "CallerCity": "",
37|dev-voice-17070  |       "ToCity": "",
37|dev-voice-17070  |       "FromCountry": "US",
37|dev-voice-17070  |       "Caller": "+18885891791",
37|dev-voice-17070  |       "FromCity": "",
37|dev-voice-17070  |       "CalledState": "",
37|dev-voice-17070  |       "FromZip": "",
37|dev-voice-17070  |       "FromState": ""
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:48:41.884 +0000] INFO: Call status ..
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     CallStatus: "in-progress"
37|dev-voice-17070  | [2026-02-12 11:48:41.885 +0000] ERROR: Failed to publish call event
37|dev-voice-17070  |     reqId: "req-l"
37|dev-voice-17070  |     service: "CallEventPublisher"
37|dev-voice-17070  |     eventType: "CALL_ENDED"
37|dev-voice-17070  |     err: "Could not load credentials from any providers"
37|dev-voice-17070  | incoming request: POST
37|dev-voice-17070  | incoming raw: 
37|dev-voice-17070  | [2026-02-12 11:48:41.959 +0000] INFO: 1oXPxkXaSDVqCQpMaY58MAt4H6o=
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.959 +0000] INFO: Incoming call received
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.960 +0000] INFO: Twilio validation attempt
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     context: "validateTwilioRequest"
37|dev-voice-17070  |     url: ""
37|dev-voice-17070  |     twilioSignature: ""
37|dev-voice-17070  |     authToken: "93542..."
37|dev-voice-17070  |     isWebSocket: false
37|dev-voice-17070  |     isWebSocket: false
37|dev-voice-17070  | [2026-02-12 11:48:41.961 +0000] INFO: Twilio validation result
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     context: "validateTwilioRequest"
37|dev-voice-17070  |     isValid: true
37|dev-voice-17070  | [2026-02-12 11:48:41.961 +0000] INFO: twiml response 
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     twimlResponse: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n                <Response>\n                    <
Connect>\n                        <Stream url=\"wss://4.227.208.77/media-stream/CA1a82a67c48866944486ea46ff1dce023/ZWxldmVubGFic19sdVZF
eWhUM0NvY0xaYUxCcHM4dg==/aHR0cDovL2xvY2FsaG9zdDoxNzAwMC9xdWVyeQ==\">\n                        <Parameter name=\"sttData\" value=\"eyJsb
2NhbGUiOiJlbi1VUyJ9\" />\n                        </Stream>\n                    </Connect>\n                </Response>"
37|dev-voice-17070  | [2026-02-12 11:48:41.961 +0000] INFO: Valid Twilio request signature
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.961 +0000] INFO: TwiML response sent
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.961 +0000] ERROR: Failed to publish call event
37|dev-voice-17070  |     reqId: "req-m"
37|dev-voice-17070  |     CallSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "CallEventPublisher"
37|dev-voice-17070  |     eventType: "CALL_STARTED"
37|dev-voice-17070  |     err: "Could not load credentials from any providers"
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: 
37|dev-voice-17070  | [2026-02-12 11:48:41.992 +0000] INFO: Validating WebSocket Twilio signature
37|dev-voice-17070  | [2026-02-12 11:48:41.992 +0000] INFO: Twilio validation attempt
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     context: "validateTwilioRequest"
37|dev-voice-17070  |     url: "wss://4.227.208.77/media-stream/CA1a82a67c48866944486ea46ff1dce023/ZWxldmVubGFic19sdVZFeWhUM0NvY0xaYUxC
cHM4dg==/aHR0cDovL2xvY2FsaG9zdDoxNzAwMC9xdWVyeQ=="
37|dev-voice-17070  |     twilioSignature: "P9Rt5uuZdgyjfOWlOHnZyUwdDos="
37|dev-voice-17070  |     authToken: "93542..."
37|dev-voice-17070  |     isWebSocket: true
37|dev-voice-17070  | [2026-02-12 11:48:41.992 +0000] INFO: Twilio validation result
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     context: "validateTwilioRequest"
37|dev-voice-17070  |     isValid: true
37|dev-voice-17070  | [2026-02-12 11:48:41.992 +0000] INFO: WebSocket signature validation passed
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: llm url
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     llmUrl: "aHR0cDovL2xvY2FsaG9zdDoxNzAwMC9xdWVyeQ=="
37|dev-voice-17070  |     voiceData: ""
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: ==
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: New WebSocket connection established
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: WebSocket parameters
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] ERROR: true
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: elevenlabs_luVEyhT3CocLZaLBps8v
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: New Object TTS
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: SpeechManager initialized
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "SpeechManager"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: [11:48:41.993] Setting up WebSocket event handlers
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: Initializing gRPC Stream
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: Silence detector initialized
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: WebSocketHandler initialized
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.993 +0000] INFO: [11:48:41.993] WebSocket handler setup complete
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [11:48:41.997] Stream started with SID: MZ12f757c25855804518b0b0d8954e653b
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] ERROR: Unknown message event:
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     error: "connected"
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: inside hanlde start
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: {"event":"start","sequenceNumber":"1","start":{"accountSid":"ACe25e10d0db6a
5f5823512c2ecc33e8f4","streamSid":"MZ12f757c25855804518b0b0d8954e653b","callSid":"CA1a82a67c48866944486ea46ff1dce023","tracks":["inboun
d"],"mediaFormat":{"encoding":"audio/x-mulaw","sampleRate":8000,"channels":1},"customParameters":{"sttData":"eyJsb2NhbGUiOiJlbi1VUyJ9"}
},"streamSid":"MZ12f757c25855804518b0b0d8954e653b"}
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: ===================Initiating Conversation=========================
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: "##########"
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: "http://localhost:17000/query"
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: sent interruption as false on utterance ##########
37|dev-voice-17070  | [2026-02-12 11:48:41.997 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=%23%23%23%23%23%23%23%23%23%23&callid=CA1a82a67c48866944486ea46
ff1dce023&interrupted=false&silence=false"
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO: Silence detection started
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO: STT Data decoded
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO:
37|dev-voice-17070  |     0: "audioTransformer"
37|dev-voice-17070  |     1: "transcribeService"
37|dev-voice-17070  |     2: "ttsService"
37|dev-voice-17070  |     3: "responseService"
37|dev-voice-17070  |     4: "cleanup"
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO: create readable stream
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "AudioTransformer"
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO: startStream service started
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO: Initializing Azure Speech client
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:48:41.998 +0000] INFO: STT Data received:
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:48:41.999 +0000] INFO: Azure Speech recognition started
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:48:41 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '169',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=%23%23%23%23%23%23%23%23%23%23&callid=CA1a82a67c48866944486ea46ff
1dce023&interrupted=false&silence=false'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm {
37|dev-voice-17070  |   assistant: 'Welcome to Latitude Financial Services. Calls may be recorded for quality and record-keeping purpos
es. This is Alex, how can I help you?',
37|dev-voice-17070  |   cut_call: false
37|dev-voice-17070  | }
37|dev-voice-17070  | tts payload {"assistant":"Welcome to Latitude Financial Services. Calls may be recorded for quality and record-ke
eping purposes. This is Alex, how can I help you?"}
37|dev-voice-17070  | [11:48:42.094] TTS started
37|dev-voice-17070  | [2026-02-12 11:48:42.091 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:48:42.092 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": "Welcome to Latitude Financial Services. Calls may be recorded for quality and record-keeping 
purposes. This is Alex, how can I help you?",
37|dev-voice-17070  |       "cut_call": false
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:48:42.093 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 95.686954
37|dev-voice-17070  |     sessionId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:42.093 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:42.094 +0000] INFO: Starting TTS generation
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     response: "Welcome to Latitude Financial Services. Calls may be recorded for quality and record-keeping purpo
ses. This is Alex, how can I help you?"
37|dev-voice-17070  | [2026-02-12 11:48:42.094 +0000] INFO: {"assistant":"Welcome to Latitude Financial Services. Calls may be recorded
 for quality and record-keeping purposes. This is Alex, how can I help you?"}
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     ttsPayload: "{\"assistant\":\"Welcome to Latitude Financial Services. Calls may be recorded for quality and r
ecord-keeping purposes. This is Alex, how can I help you?\"}"
37|dev-voice-17070  | [2026-02-12 11:48:42.095 +0000] INFO: Starting ElevenLabs TTS synthesis
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     textLength: 152
37|dev-voice-17070  | [2026-02-12 11:48:42.095 +0000] INFO:
37|dev-voice-17070  |     _options: {
37|dev-voice-17070  |       "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:48:42.095 +0000] INFO: OYTbf65OHHFELVut7v2H
37|dev-voice-17070  | [2026-02-12 11:48:42.095 +0000] INFO: eleven_flash_v2_5
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [11:48:50.902] Sending stop TTS signal
37|dev-voice-17070  | [2026-02-12 11:48:50.902 +0000] INFO: TTS stopped
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "SpeechManager"
37|dev-voice-17070  |     interrupted: false
37|dev-voice-17070  | [2026-02-12 11:48:50.902 +0000] INFO: sending stop tts signal
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:50.902 +0000] INFO: 10.0.12.6
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:50.902 +0000] INFO: Processed mark event
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     markName: "endMark"
37|dev-voice-17070  |     remainingMarks: 0
37|dev-voice-17070  | [2026-02-12 11:48:50.902 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [AudioStreamer Worker] Preloaded 176283 bytes of audio data
37|dev-voice-17070  | [2026-02-12 11:48:53.306 +0000] INFO: SPEECH START DETECTED
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:48:53.410 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     text: "hi my"
37|dev-voice-17070  | [2026-02-12 11:48:53.410 +0000] INFO: Background Audio Streamer Started
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:48:53.611 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     text: "hi my name is"
37|dev-voice-17070  | [2026-02-12 11:48:59.110 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     text: "hi my name is ankit"
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [AudioStreamer Worker] End of buffer reached.
37|dev-voice-17070  | [2026-02-12 11:49:13.911 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     text: "hi my name is ankit nad"
37|dev-voice-17070  | [2026-02-12 11:49:14.013 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     text: "hi my name is ankit nadia"
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [AudioStreamer Worker] End of buffer reached.
37|dev-voice-17070  | [AudioStreamer Worker] End of buffer reached.
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [11:49:31.042] Final transcript: "Hi my name is Ankit Nadia."
37|dev-voice-17070  | [11:49:31.042] Processing transcript: "Hi my name is Ankit Nadia."
37|dev-voice-17070  | [2026-02-12 11:49:31.042 +0000] INFO: SPEECH PROCESS [LATENCY], DURATION MS: 17029.61
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:49:31.042 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: "Hi my name is Ankit Nadia."
37|dev-voice-17070  | [2026-02-12 11:49:31.042 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: "http://localhost:17000/query"
37|dev-voice-17070  | [2026-02-12 11:49:31.043 +0000] INFO: sent interruption as false on utterance Hi my name is Ankit Nadia.
37|dev-voice-17070  | [2026-02-12 11:49:31.043 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=Hi+my+name+is+Ankit+Nadia.&callid=CA1a82a67c48866944486ea46ff1d
ce023&interrupted=false&silence=false"
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:49:30 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '138',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=Hi+my+name+is+Ankit+Nadia.&callid=CA1a82a67c48866944486ea46ff1dce
023&interrupted=false&silence=false'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm {
37|dev-voice-17070  |   assistant: "I'm sorry but Ankit Nadia still doesn't match our records, do I have your consent to disconnect the
 call?",
37|dev-voice-17070  |   cut_call: false
37|dev-voice-17070  | }
37|dev-voice-17070  | Audio streaming stopped.
37|dev-voice-17070  | tts payload {"assistant":"I'm sorry but Ankit Nadia still doesn't match our records, do I have your consent to di
sconnect the call?"}
37|dev-voice-17070  | [11:49:32.047] TTS started
37|dev-voice-17070  | [AudioStreamer Worker] Audio streaming stopped.
37|dev-voice-17070  | Audio streamer worker stopped with exit code 1
37|dev-voice-17070  | [2026-02-12 11:49:32.046 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": "I'm sorry but Ankit Nadia still doesn't match our records, do I have your consent to disconne
ct the call?",
37|dev-voice-17070  |       "cut_call": false
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 1004.454867
37|dev-voice-17070  |     sessionId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: Starting TTS generation
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     response: "I'm sorry but Ankit Nadia still doesn't match our records, do I have your consent to disconnect th
e call?"
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: {"assistant":"I'm sorry but Ankit Nadia still doesn't match our records, do
 I have your consent to disconnect the call?"}
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     ttsPayload: "{\"assistant\":\"I'm sorry but Ankit Nadia still doesn't match our records, do I have your conse
nt to disconnect the call?\"}"
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: Starting ElevenLabs TTS synthesis
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     textLength: 121
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO:
37|dev-voice-17070  |     _options: {
37|dev-voice-17070  |       "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |     }
37|dev-voice-17070  |     _textToSpeech: {
37|dev-voice-17070  |       "_options": {
37|dev-voice-17070  |         "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |       }
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: OYTbf65OHHFELVut7v2H
37|dev-voice-17070  | [2026-02-12 11:49:32.047 +0000] INFO: eleven_flash_v2_5
37|dev-voice-17070  | [11:49:37.662] Sending stop TTS signal
37|dev-voice-17070  | [2026-02-12 11:49:37.662 +0000] INFO: TTS stopped
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "SpeechManager"
37|dev-voice-17070  |     interrupted: false
37|dev-voice-17070  | [2026-02-12 11:49:37.662 +0000] INFO: sending stop tts signal
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:49:37.662 +0000] INFO: 10.0.12.6
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:49:37.662 +0000] INFO: Processed mark event
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     markName: "endMark"
37|dev-voice-17070  |     remainingMarks: 0
37|dev-voice-17070  | [2026-02-12 11:49:37.662 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [AudioStreamer Worker] Preloaded 176283 bytes of audio data
37|dev-voice-17070  | [2026-02-12 11:49:51.938 +0000] INFO: Partial transcription
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     text: "yes please"
37|dev-voice-17070  | [2026-02-12 11:49:51.938 +0000] INFO: Background Audio Streamer Started
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [AudioStreamer Worker] End of buffer reached.
37|dev-voice-17070  | [2026-02-12 11:50:06.392 +0000] INFO: {"privSessionId":"60EEB65F73C94506970C59C3A264212E","privOffset":51000000}
37|dev-voice-17070  |     reqId: "req-2"
37|dev-voice-17070  |     callId: "sim-1770896694695"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:50:10 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '16',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=&callid=CA1a82a67c48866944486ea46ff1dce023&interrupted=false&sile
nce=true'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm { assistant: '' }
37|dev-voice-17070  | Audio streaming stopped.
37|dev-voice-17070  | [AudioStreamer Worker] Audio streaming stopped.
37|dev-voice-17070  | Audio streamer worker stopped with exit code 1
37|dev-voice-17070  | [2026-02-12 11:50:11.938 +0000] INFO: Emitting silence warning
37|dev-voice-17070  |     warningLevel: 0
37|dev-voice-17070  |     message: "initiation from LLM"
37|dev-voice-17070  | [2026-02-12 11:50:11.938 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: ""
37|dev-voice-17070  | [2026-02-12 11:50:11.938 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: "http://localhost:17000/query"
37|dev-voice-17070  | [2026-02-12 11:50:11.938 +0000] INFO: sent interruption as false on utterance 
37|dev-voice-17070  | [2026-02-12 11:50:11.938 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=&callid=CA1a82a67c48866944486ea46ff1dce023&interrupted=false&si
lence=true"
37|dev-voice-17070  | [2026-02-12 11:50:11.941 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:50:11.941 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": ""
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:50:11.941 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 3.096437
37|dev-voice-17070  |     sessionId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:11.942 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [11:50:15.309] Final transcript: "Yes, please."
37|dev-voice-17070  | [11:50:15.309] Processing transcript: "Yes, please."
37|dev-voice-17070  | incoming request: GET
37|dev-voice-17070  | incoming raw: /
37|dev-voice-17070  | [2026-02-12 11:50:15.308 +0000] INFO: SPEECH PROCESS [LATENCY], DURATION MS: 23370.56
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:15.309 +0000] INFO: Generating agent response
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     transcript: "Yes, please."
37|dev-voice-17070  | [2026-02-12 11:50:15.309 +0000] INFO: Generating response from local API
37|dev-voice-17070  |     llmUrl: "http://localhost:17000/query"
37|dev-voice-17070  | [2026-02-12 11:50:15.309 +0000] INFO: sent interruption as false on utterance Yes, please.
37|dev-voice-17070  | [2026-02-12 11:50:15.309 +0000] INFO: llm url..
37|dev-voice-17070  |     url: "http://localhost:17000/query?STT_output=Yes%2C+please.&callid=CA1a82a67c48866944486ea46ff1dce023&interr
upted=false&silence=false"
37|dev-voice-17070  | response from llm Response {
37|dev-voice-17070  |   status: 200,
37|dev-voice-17070  |   statusText: 'OK',
37|dev-voice-17070  |   headers: Headers {
37|dev-voice-17070  |     date: 'Thu, 12 Feb 2026 11:50:14 GMT',
37|dev-voice-17070  |     server: 'uvicorn',
37|dev-voice-17070  |     'content-length': '157',
37|dev-voice-17070  |     'content-type': 'application/json'
37|dev-voice-17070  |   },
37|dev-voice-17070  |   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
37|dev-voice-17070  |   bodyUsed: false,
37|dev-voice-17070  |   ok: true,
37|dev-voice-17070  |   redirected: false,
37|dev-voice-17070  |   type: 'basic',
37|dev-voice-17070  |   url: 'http://localhost:17000/query?STT_output=Yes%2C+please.&callid=CA1a82a67c48866944486ea46ff1dce023&interrup
ted=false&silence=false'
37|dev-voice-17070  | }
37|dev-voice-17070  | generatedResponse from llm {
37|dev-voice-17070  |   assistant: `Alright, I'm going to go ahead and disconnect the call now, thank you so much for your time, and ha
ve a great day, goodbye",`,
37|dev-voice-17070  |   cut_call: true
37|dev-voice-17070  | }
37|dev-voice-17070  | tts payload {"assistant":"Alright, I'm going to go ahead and disconnect the call now, thank you so much for your 
time, and have a great day, goodbye\","}
37|dev-voice-17070  | [11:50:16.166] TTS started
37|dev-voice-17070  | [2026-02-12 11:50:16.165 +0000] INFO: response from llm
37|dev-voice-17070  |     response: {}
37|dev-voice-17070  | [2026-02-12 11:50:16.165 +0000] INFO: generatedResponse from llm
37|dev-voice-17070  |     generatedResponse: {
37|dev-voice-17070  |       "assistant": "Alright, I'm going to go ahead and disconnect the call now, thank you so much for your time, 
and have a great day, goodbye\",",
37|dev-voice-17070  |       "cut_call": true
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO:
37|dev-voice-17070  |     type: "local_api_latency"
37|dev-voice-17070  |     latency: 856.911527
37|dev-voice-17070  |     sessionId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO: Background Audio Streamer Stopping
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO: Starting TTS generation
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     response: "Alright, I'm going to go ahead and disconnect the call now, thank you so much for your time, and h
ave a great day, goodbye\","
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO: {"assistant":"Alright, I'm going to go ahead and disconnect the call now, t
hank you so much for your time, and have a great day, goodbye\","}
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     ttsPayload: "{\"assistant\":\"Alright, I'm going to go ahead and disconnect the call now, thank you so much f
or your time, and have a great day, goodbye\\",\"}"
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO: Starting ElevenLabs TTS synthesis
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     textLength: 141
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO:
37|dev-voice-17070  |     _options: {
37|dev-voice-17070  |       "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |     }
37|dev-voice-17070  |     _textToSpeech: {
37|dev-voice-17070  |       "_options": {
37|dev-voice-17070  |         "apiKey": "sk_06825e7722efd7dbdc52be2ec401da9a937c7042d132a2fa"
37|dev-voice-17070  |       }
37|dev-voice-17070  |     }
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO: OYTbf65OHHFELVut7v2H
37|dev-voice-17070  | [2026-02-12 11:50:16.166 +0000] INFO: eleven_flash_v2_5
37|dev-voice-17070  | [11:50:20.670] Handling stop event
37|dev-voice-17070  | [11:50:20.671] Speech manager cleaned up
37|dev-voice-17070  | [CA1a82a67c48866944486ea46ff1dce023] ✅ Stream Complete. Frames: 313
37|dev-voice-17070  | [11:50:20.742] Speech manager cleaned up
37|dev-voice-17070  | incoming request: POST
37|dev-voice-17070  | incoming raw: /v1/calls/status
37|dev-voice-17070  | [2026-02-12 11:50:20.615 +0000] INFO: Attempting to disconnect call:
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:20.664 +0000] INFO: Client state:
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:20.670 +0000] INFO: Closing Stream
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:50:20.670 +0000] INFO: Silence detector cleaned up
37|dev-voice-17070  | [2026-02-12 11:50:20.671 +0000] INFO: stopStream service initiated
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:50:20.671 +0000] INFO: url for post call
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     url: "http://localhost:17000/call_summary?callid=CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:20.671 +0000] INFO: Azure Speech client cleaned up
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "TranscribeService"
37|dev-voice-17070  | [2026-02-12 11:50:20.671 +0000] INFO: Cleaning up services
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:20.741 +0000] INFO: {"privSessionId":"80D23E2310E8440793225AD460092074","privOffset":100000000}
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  | [2026-02-12 11:50:20.742 +0000] INFO: Recognition session stopped
37|dev-voice-17070  |     reqId: "req-n"
37|dev-voice-17070  |     callId: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  |     service: "WebSocketHandler"
37|dev-voice-17070  |     callSid: "CA1a82a67c48866944486ea46ff1dce023"
37|dev-voice-17070  | [2026-02-12 11:50:20.742 +0000] INFO: Silence detector cleaned up
37|dev-voice-17070  | [2026-02-12 11:50:20.742 +0000] INFO: stopStream service initiated
