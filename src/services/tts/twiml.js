// src/services/tts/twiml.js
import twilio from "twilio";
import { logger } from "../../utils/logger.js";
export class TwiMLTTSService {
  
  constructor(config) {
    this.client = new twilio(config.twilio.accountSid, config.twilio.authToken);
  }

  async createCallRecording(callSid) {
    logger.info({callId:callSid},"Attempting to create call recording:", callSid);
    const recording = await this.client
      .calls(callSid)
       .recordings.create({
        recordingChannels: "dual",
        recordingStatusCallback: this.config.twilio.recordingStatusCallbackUrl,
        recordingStatusCallbackEvent: ["completed"],
      });

    logger.info({callId:callSid},recording.accountSid);
  }

  async disconnectCall(callSid) {
    logger.info({callId:callSid},"Attempting to disconnect call:", callSid);
    logger.info({callId:callSid},"Client state:", {
      hasClient: !!this.client,
      hasCalls: !!this.client.calls,
    });

    try {
      const response = await this.client
        .calls(callSid)
        .update({ status: "completed" });

      logger.info({callId:callSid},"Disconnect response:", response);
      return response;
    } catch (error) {
      logger.error("Full error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      throw error;
    }
  }

  // async sendSms(body) {
  //   logger.info("Attempting to send SMS");
  //   logger.info("Client state:", {
  //     hasClient: !!this.client,
  //     hasMessages: !!this.client.messages,
  //   });

  //   try {
  //     const response = await this.client.messages.create({
  //       to: "+919873750314", // Recipient's phone number
  //       from: "+18777025069", // Your Twilio phone number
  //       body: body, // Message content
  //     });

  //     logger.info("SMS send response:", response);
  //     return response;
  //   } catch (error) {
  //     logger.error("Full error:", {
  //       message: error.message,
  //       code: error.code,
  //       stack: error.stack,
  //     });
  //     throw error;
  //   }
  // }

  async transferCall(callSid) {
    console.log("Attempting to transfer call:", callSid);
    console.log("Client state:", {
      hasClient: !!this.client,
      hasCalls: !!this.client.calls,
    });

    const twimlBinUrl = this.config.twilio.twimlBinUrl;
    const response = await this.client
      .calls(callSid)
      .update({
        url: twimlBinUrl,
        method: "POST",
      })
      .then((call) => {
        console.log(`✅ Call ${callSid} successfully forwarded.`);
      })
      .catch((error) => {
        console.error(`❌ Failed to forward call ${callSid}: ${error.message}`);
      });
  }

}
