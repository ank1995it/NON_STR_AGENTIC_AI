// __define-ocg__ Centralized Azure Service Bus manager (ES6)
import { ServiceBusClient } from "@azure/service-bus";

class ServiceBusManager {
  static varOcgClient = null;
  static varOcgSenders = new Map();

  static init(connectionString) {
    if (!ServiceBusManager.varOcgClient) {
      ServiceBusManager.varOcgClient = new ServiceBusClient(connectionString);
      console.log("Azure Service Bus initialized");
    }
  }

  static getSender(topicName) {
    if (!ServiceBusManager.varOcgClient) {
      throw new Error("ServiceBusManager not initialized");
    }

    if (!ServiceBusManager.varOcgSenders.has(topicName)) {
      const sender =
        ServiceBusManager.varOcgClient.createSender(topicName);
      ServiceBusManager.varOcgSenders.set(topicName, sender);
    }

    return ServiceBusManager.varOcgSenders.get(topicName);
  }

  static async send(topicName, payload, options = {}) {
    const sender = ServiceBusManager.getSender(topicName);

    const message = {
      body: payload,
      contentType: "application/json",
      subject: payload.eventType,
      messageId: options.messageId,
      applicationProperties: options.applicationProperties
    };

    await sender.sendMessages(message);
  }

  static async shutdown() {
    for (const sender of ServiceBusManager.varOcgSenders.values()) {
      await sender.close();
    }

    if (ServiceBusManager.varOcgClient) {
      await ServiceBusManager.varOcgClient.close();
      ServiceBusManager.varOcgClient = null;
    }
  }
}

export default ServiceBusManager;
