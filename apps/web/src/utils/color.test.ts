import { contrastRatio } from './color';

describe('contrastRatio', () => {
  it('white/black high', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeGreaterThan(4.5);
  });
});
