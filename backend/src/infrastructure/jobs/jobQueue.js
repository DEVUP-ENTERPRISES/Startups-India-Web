const { logger } = require('../observability/logger');

class InMemoryJobQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.handlers = new Map();
    this._drainPromise = null;
  }

  register(jobName, handler) {
    this.handlers.set(jobName, handler);
  }

  enqueue(jobName, payload, options = {}) {
    this.queue.push({
      jobName,
      payload,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      delayMs: options.delayMs || 0,
    });
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      const handler = this.handlers.get(job.jobName);

      if (!handler) {
        logger.warn('Job handler not found', { jobName: job.jobName });
        continue;
      }

      try {
        if (job.delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, job.delayMs));
        }
        await handler(job.payload);
      } catch (error) {
        job.attempts += 1;
        if (job.attempts < job.maxAttempts) {
          this.queue.push(job);
        } else {
          logger.error('Job failed after max retries', {
            jobName: job.jobName,
            attempts: job.attempts,
            error: error.message,
            payload: job.payload,
          });
        }
      }
    }

    this.processing = false;

    // Resolve any pending drain waiter
    if (this._drainResolve) {
      this._drainResolve();
      this._drainResolve = null;
    }
  }

  // Wait for all in-flight jobs to complete - used in graceful shutdown
  drain(timeoutMs = 10000) {
    if (this.queue.length === 0 && !this.processing) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this._drainResolve = resolve;
      setTimeout(() => {
        if (this._drainResolve) {
          logger.warn('Job queue drain timeout - forcing shutdown', {
            remainingJobs: this.queue.length,
          });
          this._drainResolve = null;
          resolve();
        }
      }, timeoutMs);
    });
  }

  get pendingCount() {
    return this.queue.length;
  }
}

const jobQueue = new InMemoryJobQueue();

module.exports = { jobQueue };
