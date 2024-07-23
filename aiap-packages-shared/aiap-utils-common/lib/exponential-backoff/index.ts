/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export class ExponentialBackoff {

  max_retries: any;
  backoff_delay: any;

  constructor(max_retries, backoff_delay) {
    this.max_retries = max_retries;
    this.backoff_delay = backoff_delay;
  }

  exponentialBackoff(attempt, delay) {
    return delay + Math.floor(Math.random() * Math.pow(2, this.max_retries - attempt) * delay);
  }

  retry(retries, fn) {
    return fn(retries).catch(err => (retries > 1 ? this.retry(retries - 1, fn) : Promise.reject(err)));
  }

  pause(duration) {
    return new Promise(res => setTimeout(res, duration));
  }

  backoff(retries, fn, delay = 500) {
    return fn(retries).catch(err =>
      retries > 1
        ? this.pause(delay).then(() =>
          this.backoff(retries - 1, fn, this.exponentialBackoff(retries, this.backoff_delay))
        )
        : Promise.reject(err)
    );
  }
}
