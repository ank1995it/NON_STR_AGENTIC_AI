// src/services/response/basic-generator.js
import { BaseResponseGenerator } from './base.js';
import { logger } from '../../utils/logger.js';

export class BasicResponseGenerator extends BaseResponseGenerator {
    constructor() {
        super();
        this.responses = {
            greeting: [
                "Hello! How can I help you today?",
                "Hi there! What can I do for you?",
                "Welcome! How may I assist you?"
            ],
            acknowledgment: [
                "Thank you for reaching out! I completely understand your concern, and I’ll do my best to assist you. Please provide more details so I can resolve this issue efficiently.",
                "I sincerely apologize for the inconvenience you’re experiencing. Rest assured, I’m looking into this matter and will provide you with the best possible solution as soon as possible.",
                "We truly appreciate your patience and understanding. Our team is actively working on your request, and we’ll update you with any progress or resolution at the earliest convenience.",
                "I understand how important this is to you. I’ll make sure your concern is addressed immediately and will personally follow up to ensure a smooth resolution for you.",
                "I completely understand your frustration. Our goal is to provide the best service, and I assure you we’re working hard to resolve this issue as quickly as possible for you.",
                "Thank you for bringing this to our attention. We take your concerns seriously and will work diligently to resolve them. Please allow us some time to investigate and provide updates.",
                "Your satisfaction is our priority, and I appreciate your patience. We’re actively working on resolving your issue and will keep you updated throughout the process. Let me know if you need anything else.",
                "I appreciate you taking the time to reach out. I will ensure your concern is handled with urgency, and I’ll keep you updated as soon as we have more information.",
                "We understand how important this matter is to you, and we’re here to help. Our team is currently reviewing your request, and we’ll provide a solution as soon as possible.",
                "I truly apologize for any inconvenience this has caused. We value your business, and I assure you that we’re doing everything possible to resolve your concern efficiently and to your satisfaction."
              ],
            confirmation: [
                "Sure, I can help with that.",
                "Let me assist you with that.",
                "I'll help you with this."
            ],
            clarification: [
                "Could you please elaborate?",
                "Would you mind explaining more?",
                "Can you provide more details?"
            ],
            closing: [
                "Thank you for talking with me.",
                "Is there anything else you need?",
                "Let me know if you need more help."
            ]
        };
    }

    async generateResponse(transcript) {
        try {
          /**   const lowercaseTranscript = transcript.toLowerCase();
            
            if (lowercaseTranscript.includes('hello') || 
                lowercaseTranscript.includes('hi') || 
                lowercaseTranscript.includes('hey')) {
                return this.getRandomResponse('greeting');
            }

            if (lowercaseTranscript.includes('?') || 
                lowercaseTranscript.includes('what') || 
                lowercaseTranscript.includes('how') || 
                lowercaseTranscript.includes('why')) {
                return this.getRandomResponse('clarification');
            }

            if (lowercaseTranscript.includes('bye') || 
                lowercaseTranscript.includes('goodbye') || 
                lowercaseTranscript.includes('thank')) {
                return this.getRandomResponse('closing');
            } */

            return this.getRandomResponse('acknowledgment');
        } catch (error) {
            logger.error('Error in basic response generation:', error);
            return "I'm sorry, I didn't quite catch that. Could you please repeat?";
        }
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        if (!responses) {
            logger.warn(`No responses found for category: ${category}`);
            return "{\"assistant\":\""+this.responses.acknowledgment[0]+"\",\"emotion\":\"friendly\"}";
        }
        return "{\"assistant\":\""+responses[Math.floor(Math.random() * responses.length)]+"\",\"emotion\":\"friendly\"}";
    }

    getConversationHistory() {
        return []; // Basic generator doesn't maintain history
    }

    clearHistory() {
        // No-op for basic generator
    }
}
