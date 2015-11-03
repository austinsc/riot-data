export default class RateLimiter {
  constructor(maxOps, interval, allowBursts) {
    this._maxRate = allowBursts ? maxOps : maxOps / interval;
    this._interval = interval;
    this._allowBursts = allowBursts;

    this._numOps = 0;
    this._start = Date.now();
    this._queue = [];
  }

  schedule(fn) {
    const now = Date.now();
    const elapsed = now - this._start;

    if(elapsed > this._interval) {
      this._numOps = 0;
      this._start = now;
    }

    const rate = this._numOps / (this._allowBursts ? 1 : elapsed);

    if(rate < this._maxRate) {
      if(this._queue.length === 0) {
        this._numOps++;
        if(fn) {
          fn();
        }
      } else {
        if(fn) {
          this._queue.push(fn);
        }
        this._numOps++;
        this._queue.shift()();
      }
    } else {
      if(fn) {
        this._queue.push(fn);
      }

      setTimeout(function() {
        this.schedule();
      }.bind(this), 1 / this._maxRate);
    }
  }
}
