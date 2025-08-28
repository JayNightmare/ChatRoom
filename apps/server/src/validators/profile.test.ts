import { describe, it, expect } from 'vitest';
import { sanitizeDisplayName, validateNameColorAgainstBg } from './profile';

describe('profile validators', () => {
  it('sanitizes name', () => {
    expect(sanitizeDisplayName('  Hello   World  ')).toBe('Hello World');
  });
  it('validates contrast', () => {
    expect(validateNameColorAgainstBg('#ffffff', '#000000')).toBe(true);
  });
});
