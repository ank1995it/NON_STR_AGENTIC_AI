import { runSingleCall } from './single-call.js';
import { metrics } from './metrics.js';

const TOTAL_CALLS = 50; // 🔥 change this for load

async function startLoadTest() {
  const promises = [];

  for (let i = 0; i < TOTAL_CALLS; i++) {
    promises.push(runSingleCall());
  }

  await Promise.allSettled(promises);

  console.log("🎉 Load test finished");
  console.log(metrics.getReport());
}

startLoadTest();