// __define-ocg__ Simple In-Memory Metrics (Single Instance Only)

class Metrics {
    constructor() {
      this.varOcg = {
        connected: 0,
        completed: 0,
        failed: 0,
        abandoned: 0,
        active: 0,
      };
    }
  
    callConnected() {
      this.varOcg.connected++;
      this.varOcg.active++;
    }
  
    callCompleted() {
      this.varOcg.completed++;
      this.varOcg.active--;
    }
  
    callFailed() {
      this.varOcg.failed++;
      this.varOcg.active--;
    }
  
    callAbandoned() {
      this.varOcg.abandoned++;
      this.varOcg.active--;
    }
  
    getReport() {
      return this.varOcg;
    }
  }
  
  export const metrics = new Metrics();