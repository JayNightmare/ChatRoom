export class SlidingWindowRateLimiter {
  private timestamps: number[] = [];
  constructor(private max: number, private intervalMs: number) {}

  attempt(now = Date.now()): boolean {
    const cutoff = now - this.intervalMs;
    // remove old
    while (this.timestamps.length && this.timestamps[0] < cutoff) {
      this.timestamps.shift();
    }
    if (this.timestamps.length >= this.max) return false;
    this.timestamps.push(now);
    return true;
  }
}
