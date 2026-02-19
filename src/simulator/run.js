// run.js
import { runSingleCall } from './single-call.js';

const TOTAL_CALLS = 50;        // total calls to simulate
const RAMP_DELAY_MS = 300;     // delay between starting calls

let started = 0;
let completed = 0;
let failed = 0;
let active = 0;

console.log(`🚀 Starting load test with ${TOTAL_CALLS} calls...\n`);

const interval = setInterval(() => {
  if (started >= TOTAL_CALLS) {
    clearInterval(interval);
    return;
  }

  started++;
  active++;

  console.log(`📞 Call ${started} started | Active: ${active}`);

  runSingleCall()
    .then(() => {
      completed++;
      active--;
      logStatus();
    })
    .catch((err) => {
      failed++;
      active--;
      console.error(`❌ Call failed:`, err.message || err);
      logStatus();
    });

}, RAMP_DELAY_MS);

function logStatus() {
  console.log(`
📊 STATUS UPDATE
--------------------------
Started   : ${started}
Completed : ${completed}
Failed    : ${failed}
Active    : ${active}
--------------------------\n`);

  // Final summary
  if (completed + failed === TOTAL_CALLS) {
    console.log("🏁 LOAD TEST FINISHED");
    console.log(`
Final Report:
Started   : ${started}
Completed : ${completed}
Failed    : ${failed}
Success % : ${((completed / TOTAL_CALLS) * 100).toFixed(2)}%
`);
  }
}
