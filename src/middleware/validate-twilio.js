// src/middleware/validate-twilio.js
import twilio from 'twilio';
import { config } from '../config/index.js';
// import { logger } from '../utils/logger.js';
//import crypto from 'crypto';

// Utility for all Twilio request validation (WebSocket and HTTP POST)

export async function validateTwilioRequest({ request, reply = null, authToken, isWebSocket = false }) {
  const logger = request.log.child({ context: "validateTwilioRequest" });
  const twilioSignature = request.headers['x-twilio-signature'];
  if (!twilioSignature) {
      logger.warn('No Twilio signature found');
      if (reply) reply.code(400).send('Missing Twilio Signature');
      return false;
  }

  // Determine protocol and host for the URL
  let protocol;
  let host;
  let url;
  let data;

  if (isWebSocket) {
      protocol = request.headers['x-forwarded-proto'] || 'https';
      host = request.headers['x-forwarded-host'] || request.headers.host;
      url = `wss://${host}${request.raw.url}`;
      data = {}; // Or whatever payload your websocket carries (usually empty)
  } else {
      protocol = request.headers['x-forwarded-proto'] || 'https';
      host = request.headers['x-forwarded-host'] || request.headers.host;
      url = `${protocol}://${host}${request.url}`;
      data = request.body || {}; // POST/HTTP body
  }

  logger.info(
      {
          url,
          twilioSignature,
          authToken: authToken ? authToken.substring(0, 5) + '...' : undefined,
          isWebSocket
      },
      'Twilio validation attempt'
  );

  const isValid = twilio.validateRequest(authToken, twilioSignature, url, data);

  logger.info({ isValid }, 'Twilio validation result');
  if (!isValid) {
      logger.warn({ url, signature: twilioSignature }, 'Invalid Twilio signature');
      if (reply) reply.code(403).send('Invalid Twilio Signature');
  }
  return isValid;
}


export async function dummy(request, logger){
  console.log("inside dummy request new1")
  const childLogger = logger.child({ service: 'AudioTransformer12dummy'})
  childLogger.info({
    url : "new dummy123",
    data : "stream"
  }, "dummy twilio req1")

  childLogger.info(`[${new Date().toISOString().split('T')[1].slice(0, -1)}] WebSocket handler setup complete`)
  childLogger.error( {error: "msg"}, 'Audio transform error:');
  return;
}




/**
 *
export async function manualValidateWebSocket (authToken, url, signature) {
  logger.info('Manual validation:');
  logger.info( url);
  logger.info(signature);
  
  // For WebSocket with empty params, just use the URL
  const data = url;
  
  const computed =  crypto
    .createHmac('sha1', authToken)
    .update(data, 'utf-8')
    .digest('base64');
  
    logger.info({computed},'Computed signature:');
    logger.info({ match: computed === signature }, 'Match:');
  
  return computed === signature;
};

*/
