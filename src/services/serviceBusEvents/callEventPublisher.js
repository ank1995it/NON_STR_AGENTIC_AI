import ServiceBusManager from "../../utils/serviceBusManager.js";
import { config } from "../../config/index.js";

export class CallEventPublisher {
  constructor(callId, logger) {
    this.callId = callId;
    this.logger = logger.child({ service: "CallEventPublisher" });
    this.turnCounter = 0;

    this.postCallPublished = false;
  }


  async publishCallEvent(eventType, payload = {}) {
    try {
      await ServiceBusManager.send(
        config.topics.CALL_EVENTS,
        {
          eventType,
          callId: this.callId,
          timestamp: new Date().toISOString(),
          ...payload
        },
        {
          messageId: `${this.callId}-${eventType}`,
          applicationProperties: {
            callId: this.callId,
            eventType
          }
        },
        this.logger
      );

      this.logger.info({ eventType }, "Call event published");
    } catch (err) {
      this.logger.error(
        { err: err.message, eventType },
        "Failed to publish call event"
      );
    }
  }


  async publishTranscript(eventType, text, extra = {}) {
    const turnId = ++this.turnCounter;

    try {
      await ServiceBusManager.send(
        config.topics.CALL_TRANSCRIPTS,
        {
          eventType,
          callId: this.callId,
          turnId,
          sequence: turnId,
          text,
          timestamp: new Date().toISOString(),
          ...extra
        },
        {
          messageId: `${this.callId}-${eventType}-${turnId}`,
          applicationProperties: {
            callId: this.callId,
            eventType,
            turnId
          }
        },
        this.logger
      );

      this.logger.info(
        { eventType, turnId },
        "Transcript event published"
      );
    } catch (err) {
      this.logger.error(
        { err: err.message, eventType },
        "Failed to publish transcript event"
      );
    }
  }


  async publishPostCallSummary(summaryData = {}) {
    if (this.postCallPublished) return;
    this.postCallPublished = true;

    const payload = {
      eventType: "POST_CALL_SUMMARY_READY",
      callId: this.callId,
      timestamp: new Date().toISOString(),
      ...summaryData
    };

    try {
      await ServiceBusManager.send(
        config.topics.POST_CALL,
        payload,
        {
          messageId: `${this.callId}-POST_CALL_READY`,
          applicationProperties: {
            callId: this.callId,
            eventType: payload.eventType
          }
        },
        this.logger
      );

      this.logger.info("Post-call summary published");
    } catch (err) {
      this.logger.error(
        { err: err.message },
        "Failed to publish post-call summary"
      );
    }
  }
}
