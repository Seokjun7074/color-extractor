import { LABProp } from '@/types/color';

export const rgbToHex = (r: number, g: number, b: number) => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

export function rgbToLab({ r, g, b }: { r: number; g: number; b: number }): LABProp {
  // 1. RGB → [0,1] 정규화
  let R = r / 255;
  let G = g / 255;
  let B = b / 255;

  // 2. 감마 보정
  R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
  G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
  B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

  // 3. RGB → XYZ
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

  // 4. XYZ 기준값(D65)
  const Xn = 0.95047;
  const Yn = 1.0;
  const Zn = 1.08883;

  // 5. XYZ → LAB
  function f(t: number) {
    return t > 0.008856 ? Math.cbrt(t) : (903.3 * t + 16) / 116;
  }
  const fx = f(X / Xn);
  const fy = f(Y / Yn);
  const fz = f(Z / Zn);

  const lab_L = 116 * fy - 16;
  const lab_A = 500 * (fx - fy);
  const lab_B = 200 * (fy - fz);

  return { l: lab_L, a: lab_A, b: lab_B };
}
