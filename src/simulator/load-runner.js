import { simulateCall } from './call-simulator.js';
import { CONFIG } from './config.js';

let activeCalls = 0;
let callIndex = 0;

console.log('🚀 Starting load test');

const rampInterval = setInterval(async () => {
  if (activeCalls >= CONFIG.MAX_CALLS) {
    clearInterval(rampInterval);
    console.log('✅ Max load reached');
    return;
  }

  for (let i = 0; i < CONFIG.RAMP_UP_COUNT; i++) {
    callIndex++;
    activeCalls++;

    simulateCall(callIndex)
      .catch(err => console.error('Call failed', err))
      .finally(() => activeCalls--);
  }

  console.log(`📞 Active calls: ${activeCalls}`);

}, CONFIG.RAMP_UP_EVERY_MS);
