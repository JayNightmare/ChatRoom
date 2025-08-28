import { describe, it, expect } from 'vitest';
import { SlidingWindowRateLimiter } from './rateLimit';

describe('SlidingWindowRateLimiter', () => {
  it('enforces max', () => {
    const rl = new SlidingWindowRateLimiter(2, 1000);
    expect(rl.attempt(0)).toBe(true);
    expect(rl.attempt(10)).toBe(true);
    expect(rl.attempt(20)).toBe(false);
    expect(rl.attempt(1200)).toBe(true);
  });
});
