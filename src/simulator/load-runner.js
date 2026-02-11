// load-runner.js

import { simulateCall } from './call-simulator.js';

// ================= TEST CONFIG =================
const TEST_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CONCURRENT_CALLS = 20;
const RAMP_STEP = 5;
const RAMP_INTERVAL_MS = 30_000;

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

let callIndex = 0;
let rampInterval = null;

console.log('🚀 Starting load test');
console.log(`⏱ Test duration        : ${TEST_DURATION_MS / 60000} minutes`);
console.log(`📞 Max concurrency     : ${MAX_CONCURRENT_CALLS}`);
console.log(`📈 Ramp                : +${RAMP_STEP} calls every ${RAMP_INTERVAL_MS / 1000}s\n`);

// ================= RAMP LOGIC =================
rampInterval = setInterval(() => {
  for (let i = 0; i < RAMP_STEP; i++) {
    if (metrics.activeCalls >= MAX_CONCURRENT_CALLS) break;

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
}, RAMP_INTERVAL_MS);

// ================= STOP AFTER TEST DURATION =================
setTimeout(() => {
  console.log('\n⏹ Test duration reached. Stopping ramp...\n');
  clearInterval(rampInterval);

  // Wait for in-flight calls to finish
  const waitForFinish = setInterval(() => {
    if (metrics.activeCalls === 0) {
      clearInterval(waitForFinish);
      metrics.endTime = Date.now();
      printSummary();
    }
  }, 1000);
}, TEST_DURATION_MS);

// ================= SUMMARY =================
function printSummary() {
  const durationMs = metrics.endTime - metrics.startTime;
  const durationSec = (durationMs / 1000).toFixed(1);
  const durationMin = (durationSec / 60).toFixed(2);

  console.log('\n========== LOAD TEST SUMMARY ==========');
  console.log(`Test duration (min)    : ${durationMin}`);
  console.log(`Total calls started   : ${metrics.totalCallsStarted}`);
  console.log(`Calls connected       : ${metrics.totalCallsConnected}`);
  console.log(`Calls ended           : ${metrics.totalCallsEnded}`);
  console.log(`Failed calls          : ${metrics.failedCalls}`);
  console.log(`Max concurrent calls  : ${metrics.maxConcurrentCalls}`);
  console.log(
    `Calls per minute      : ${(metrics.totalCallsConnected / durationMin).toFixed(2)}`
  );
  console.log('======================================\n');
}
