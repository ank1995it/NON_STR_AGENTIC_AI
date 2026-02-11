import { runSingleCall } from './single-call.js';

runSingleCall()
  .then(() => {
    console.log("Call simulation finished");
  })
  .catch((err) => {
    console.error("Simulation error:", err);
  });
