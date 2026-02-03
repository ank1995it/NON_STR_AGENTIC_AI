// import { simulateCall } from './call-simulator.js';
// import { CONFIG } from './config.js';

// let activeCalls = 0;
// let callIndex = 0;

// console.log('🚀 Starting load test');

// const rampInterval = setInterval(async () => {
//   if (activeCalls >= CONFIG.MAX_CALLS) {
//     clearInterval(rampInterval);
//     console.log('✅ Max load reached');
//     return;
//   }

//   for (let i = 0; i < CONFIG.RAMP_UP_COUNT; i++) {
//     callIndex++;
//     activeCalls++;

//     simulateCall(callIndex)
//       .catch(err => console.error('Call failed', err))
//       .finally(() => activeCalls--);
//   }

//   console.log(`📞 Active calls: ${activeCalls}`);

// }, CONFIG.RAMP_UP_EVERY_MS);


// load-runner.js

import { simulateCall } from './call-simulator.js';
import CONFIG from './config.js';

// ================= METRICS =================
const metrics = {
  totalCallsStarted: 0,
  totalCallsConnected: 0,
  totalCallsEnded: 0,
  failedCalls: 0,
  activeCalls: 0,
  maxConcurrentCalls: 0,
  startTime: Date.now(),
  endTime: null
};

// ================= RAMP CONFIG =================
const START_CALLS = 5;
const MAX_CALLS = 100;
const RAMP_STEP = 5;
const RAMP_INTERVAL_MS = 30_000;

let callIndex = 0;
let callsToStart = START_CALLS;

console.log('🚀 Starting load test...');
console.log(`Target concurrency: ${MAX_CALLS}`);
console.log(`Ramp: +${RAMP_STEP} every ${RAMP_INTERVAL_MS / 1000}s\n`);

const rampInterval = setInterval(() => {
  for (let i = 0; i < RAMP_STEP; i++) {
    if (metrics.activeCalls >= MAX_CALLS) break;

    callIndex++;

    metrics.totalCallsStarted++;
    metrics.activeCalls++;

    if (metrics.activeCalls > metrics.maxConcurrentCalls) {
      metrics.maxConcurrentCalls = metrics.activeCalls;
    }

    simulateCall(callIndex, metrics)
      .then(() => {
        metrics.totalCallsEnded++;
      })
      .catch(err => {
        metrics.failedCalls++;
        console.error(`❌ Call ${callIndex} failed:`, err.message);
      })
      .finally(() => {
        metrics.activeCalls--;
      });
  }

  console.log(`📞 Active calls: ${metrics.activeCalls}`);

  if (metrics.activeCalls >= MAX_CALLS) {
    clearInterval(rampInterval);
    console.log('\n✅ Max load reached, waiting for calls to finish...\n');

    const waitForFinish = setInterval(() => {
      if (metrics.activeCalls === 0) {
        clearInterval(waitForFinish);
        metrics.endTime = Date.now();
        printSummary();
      }
    }, 1000);
  }
}, RAMP_INTERVAL_MS);

// ================= SUMMARY =================
function printSummary() {
  const durationMs = metrics.endTime - metrics.startTime;
  const durationSec = (durationMs / 1000).toFixed(1);
  const durationMin = (durationSec / 60).toFixed(2);

  console.log('\n========== LOAD TEST SUMMARY ==========');
  console.log(`Duration (minutes)     : ${durationMin}`);
  console.log(`Total Calls Started    : ${metrics.totalCallsStarted}`);
  console.log(`Calls Connected        : ${metrics.totalCallsConnected}`);
  console.log(`Calls Ended            : ${metrics.totalCallsEnded}`);
  console.log(`Failed Calls           : ${metrics.failedCalls}`);
  console.log(`Max Concurrent Calls   : ${metrics.maxConcurrentCalls}`);
  console.log(
    `Calls / Minute         : ${(metrics.totalCallsConnected / durationMin).toFixed(2)}`
  );
  console.log('======================================\n');
}

