export function hexToRgb(hex: string) {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return {
    r: parseInt(h.slice(0,2),16),
    g: parseInt(h.slice(2,4),16),
    b: parseInt(h.slice(4,6),16)
  };
}

function srgbToLin(c: number){
  c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);
}

export function relativeLuminance(hex:string){
  const {r,g,b}=hexToRgb(hex);
  const R=srgbToLin(r);const G=srgbToLin(g);const B=srgbToLin(b);
  return 0.2126*R+0.7152*G+0.0722*B;
}

export function contrastRatio(a:string,b:string){
  const L1=relativeLuminance(a)+0.05;const L2=relativeLuminance(b)+0.05;return L1>L2?L1/L2:L2/L1;
}
