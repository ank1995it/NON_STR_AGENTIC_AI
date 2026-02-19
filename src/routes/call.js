// src/routes/call.js
import { config } from "../config/index.js";
import { setupWebSocketHandler } from "../services/speech/index.js";
import { logger } from "../utils/logger.js";
import { getAppInsightClient } from "../utils/appinsights.js";
import { validateTwilioRequest, dummy } from "../middleware/validate-twilio.js";
import fs from "fs";
import { TwiMLTTSService } from "../services/tts/twiml.js";
import { BlobServiceClient } from "@azure/storage-blob";
import axios from 'axios';
import { CallEventPublisher } from "../services/serviceBusEvents/callEventPublisher.js";

// import twilio from "twilio";
// import crypto from "crypto";

export async function callRoutes(fastify) {
  const callSchema = {
    body: {
      type: "object",
      required: ["CallSid"],
      properties: {
        CallSid: { type: "string" },
        From: { type: "string" },
        To: { type: "string" },
        Direction: { type: "string" },
      },
    },
  };

  fastify.addHook('onRequest', async (request, reply) => {
    if (request.headers.upgrade === 'websocket' && request.headers['x-twilio-signature']) {
      logger.info('Validating WebSocket Twilio signature',request);
        const valid = await validateTwilioRequest({
            request,
            reply,
            authToken: config.twilio.authToken,
            logger,
            isWebSocket: true
        });
        if (!valid) {
            // Reply is already sent within utility
            return;
        }
        logger.info('WebSocket signature validation passed');
    }

    if(request?.body?.CallSid){
      const appInsightClient = getAppInsightClient
          appInsightClient.commonProperties = {
            CallSid :  request.body.CallSid
          }
    }
});

fastify.get("/test/:callId", async (request, reply) => {
   const { callId } = request.params;
     const logger  = request.log.child({ callId});
     logger.info("inside test api")
     await dummy(request, logger);
  });

  // Handle incoming Twilio voice calls
  fastify.post("/v1/calls/incoming/:voice/:llm/:packed?", async (request, reply) => {
     const { CallSid, Direction, From, To } = request.body;
     request.log = request.log.child({ CallSid});
    try {
      request.log.info(request.headers['x-twilio-signature'], "Twilio Signature");
      //request.log.info(request.body);
      request.log.info( "Incoming call received");
      const sttData = request.query.sttData || "eyJsb2NhbGUiOiJlbi1VUyJ9";
      /* <Say voice="man" >Welcome to the Voice Assistant Service.</Say> */
      const isValid = await validateTwilioRequest({request,reply, authToken: config.twilio.authToken,
        isWebSocket: false
    });
      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
                <Response>
                    <Connect>
                        <Stream url="wss://${request.headers.host}/media-stream/${CallSid}/${request.params.voice}/${request.params.llm}">
                        <Parameter name="sttData" value="${sttData}" />
                        </Stream>
                    </Connect>
                </Response>`;
      if (!isValid) {            
        return; 
      }
      else {
        new CallEventPublisher(CallSid,request.log ).publishCallEvent("CALL_STARTED", {
          provider: "twilio",
          direction: Direction,
          from: From,
          to: To,
          callId: CallSid
        });
        request.log.info( {twimlResponse},`twiml response `);
        request.log.info("Valid Twilio request signature");
        reply.type("text/xml").send(twimlResponse);
      }

      request.log.info( "TwiML response sent");
    } catch (error) {
      request.log.error("Error handling incoming call:", error);
      throw error;
    }
  });

  // Status callback endpoint
  fastify.post("/status", async (request, reply) => {
    try {
      const { CallSid, CallStatus } = request.body;
      logger.info({ callId:CallSid, CallStatus }, "Call status update");
      reply.send({ status: "received" });
    } catch (error) {
      logger.error("Error handling status callback:", error);
      throw error;     
    }
  });

  
  fastify.post("/v1/calls/status", async (request, reply) => {
    try {
      const body = request.body;
      logger.info({ body }, "Calls status received");
      const { CallSid, CallStatus } = request.body;
      new CallEventPublisher(CallSid,request.log ).publishCallEvent("CALL_ENDED", {
           reason: "Call Completed",
           status: CallStatus
      })
      logger.info({ callId:CallSid, CallStatus }, "Call status ..");
      reply.send({ status: "received" });
    } catch (error) {
      logger.error("Error occured in call status callback:", error);
      throw error;     
    }
  });

  fastify.post("/v1/calls/post-call", async (request, reply) => {
    const body = request.body;
    const logger = request.log.child({ callId: body.callId });
    try {
      logger.info({ body }, "Post call request received");
      new CallEventPublisher(body.callId, logger).publishPostCallSummary(body);
      reply.send({ status: "received post call summary request" });
    } catch (error) {
      logger.error("Error occured in post-call status callback:", error);
      throw error;
    }
  });


  // WebSocket endpoint for media streaming
  fastify.get("/media-stream/:callId/:voiceData/:llmUrl", { websocket: true }, async (connection, req) => {
     const { callId ,voiceData , llmUrl  } = req.params;  

     const logger  = req.log.child({ callId});
     logger.info({llmUrl, voiceData, callId},"llm url")
     logger.info(llmUrl)

    try {
      //logger.info(req, "WebSocket headers");      
     // logger.info(req.headers['x-twilio-signature'], "Twilio Signature");
      
      logger.info("New WebSocket connection established");
      //const data   = req.query.data;   
      logger.info( "WebSocket parameters");
      logger.error(process.env.RECORD);
      if (config.twilio.recordCalls === "true") {
        logger.info("RECORDING ENABLED");
        new TwiMLTTSService(config).createCallRecording(callId);
      }          
      setupWebSocketHandler(connection, callId , voiceData , llmUrl, logger).catch((error) => {
                logger.error(error,"Error in WebSocket handler:");
        connection.socket.close();
      }); 
    } catch (error) { 
      logger.error(error,"Error setting up WebSocket handler:");
      connection.socket.close();
    }
  }
  );

  // Simple test endpoint
  fastify.get("/", async (request, reply) => {
    return {
      message: "Voice assistant service is running",
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get(
    "/.well-known/pki-validation/764AB309179251A626C6F3D120D10914.txt",
    (req, res) => {
      res.type("text/plain");
      console.log(fs);
      fs.readFile(
        "01101B418C41258A67852E0C58376C9C.txt",
        "utf8",
        (err, data) => {
          if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
          }
          res.send(data);
        }
      );
    }
  );

  fastify.get("/disconnect/:callId", async (request, reply) => {
    try {
      const callId = request.params.callId;
      new TwiMLTTSService(config).disconnectCall(callId);
    } catch (error) {
      logger.error("Error handling status callback:", error);
      throw error;
    }
  });

  // POST route
  fastify.post("/smsToCustomer", async (request, reply) => {
    const { message } = request.body;
    logger.info(`Received message: ${message}`);
    new TwiMLTTSService(config).sendSms(message)
  });

  // Transfer call endpoint
  fastify.get("/transfer/:callId", async (request, reply) => {
    try {
      const callId = request.params.callId;
      new TwiMLTTSService(config).transferCall(callId);
    } catch (error) {
      logger.error("Error handling status callback:", error);
      throw error;
    }
  });

  // Webhook endpoint for recording status callbacks
  fastify.post("/recording-status", async (request, reply) => {
    try {
    logger.info("Recording status webhook received:", request.body);
    logger.info('Connection String '+ config.azure.blobConnectionString);
    logger.info('Container Name '+config.azure.blobContainerName);
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      config.azure.blobConnectionString
    );
    const containerName = config.azure.blobContainerName;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const containers = blobServiceClient.listContainers();
    containers.next().then( function logContainer(result){
      if(!result.done){
        console.log('Conatiner Name '+ result.value.name)
      }
    })

    const {
      RecordingStatus,
      RecordingUrl,
      RecordingSid,
      CallSid,
      RecordingDuration,
      RecordingChannels,
    } = request.body;
    logger.info(RecordingDuration)
    logger.info(RecordingUrl)
    logger.info(RecordingChannels)
    logger.info(CallSid)
    logger.info(RecordingStatus)
    logger.info(RecordingSid)
    logger.info(config.twilio.accountSid)
    logger.info(config.twilio.authToken)
    if (RecordingStatus === "completed") {
      
        logger.info(`Processing completed recording: ${RecordingSid}`);

        // Download recording from Twilio
        const response = await axios.get(RecordingUrl, {
          auth: {
            username: config.twilio.accountSid,
            password: config.twilio.authToken,
          },
          responseType: "stream",
        });

        // Create blob name with organized structure
        const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const fileExtension = RecordingUrl.includes(".mp3") ? "mp3" : "wav";
        //const blobName = `${timestamp}/${CallSid}/${RecordingSid}.${fileExtension}`;
        const blobName = `${CallSid}.${fileExtension}`;

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload to Azure Blob with metadata
        await blockBlobClient.uploadStream(
          response.data,
          undefined,
          undefined,
          {
            blobHTTPHeaders: {
              blobContentType:
                fileExtension === "mp3" ? "audio/mp3" : "audio/wav",
            },
            metadata: {
              callSid: CallSid,
              recordingSid: RecordingSid,
              duration: RecordingDuration || "0",
              channels: RecordingChannels || "1",
              uploadedAt: new Date().toISOString(),
            },
          }
        );

        logger.info(`✅ Recording uploaded successfully: ${blobName}`);
        logger.info(
          `   Duration: ${RecordingDuration}s, Channels: ${RecordingChannels}`
        );
      
    }
} catch (error) {
        logger.error("Failed to transfer recording:", error);
        return reply.code(500).send({ error: error.message });
      }
    return reply.code(200).send("OK");
  });

}
