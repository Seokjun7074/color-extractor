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

// LAB → RGB 변환 함수
export function labToRgb({ l, a, b }: LABProp): { r: number; g: number; b: number } {
  // 1. LAB → XYZ
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const Xn = 0.95047;
  const Yn = 1.0;
  const Zn = 1.08883;

  function fInv(t: number) {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  }

  const X = Xn * fInv(fx);
  const Y = Yn * fInv(fy);
  const Z = Zn * fInv(fz);

  // 2. XYZ → RGB
  let R = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
  let G = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
  let B = X * 0.0557 + Y * -0.204 + Z * 1.057;

  // 3. 역감마 보정
  function gammaCorrect(c: number) {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  R = gammaCorrect(R);
  G = gammaCorrect(G);
  B = gammaCorrect(B);

  // 4. [0,255] 범위로 변환 및 클램핑
  return {
    r: Math.max(0, Math.min(255, Math.round(R * 255))),
    g: Math.max(0, Math.min(255, Math.round(G * 255))),
    b: Math.max(0, Math.min(255, Math.round(B * 255))),
  };
}
