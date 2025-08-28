import { contrastRatio, isTooClose, suggestions } from './color';

describe('color utils', () => {
  it('calculates contrast above 4.5 for black/white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeGreaterThan(4.5);
  });
  it('detects closeness', () => {
    expect(isTooClose('#111111', '#101010')).toBe(true);
    expect(isTooClose('#ff0000', '#00ff00')).toBe(false);
  });
  it('provides suggestions', () => {
    const sugg = suggestions('#111111', '#000000');
    expect(sugg.length).toBeGreaterThan(0);
  });
});
