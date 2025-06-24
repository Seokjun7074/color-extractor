import { kMeans } from '@/utils/kMeans';
import { RGBProp } from '@/types/color';

test('kMeans 알고리즘 결과가 RGBProp[] 타입 구조인지 확인', () => {
  const pixels: RGBProp[] = [
    { r: 255, g: 255, b: 255 },
    { r: 100, g: 0, b: 255 },
    { r: 100, g: 0, b: 255 },
  ];
  const K = 2;
  const result = kMeans(pixels, K);

  // 1. 배열인지 확인
  expect(Array.isArray(result)).toBe(true);

  // 2. 각 요소가 RGBProp 구조를 가지는지 확인
  result.forEach((item) => {
    expect(typeof item.r).toBe('number');
    expect(typeof item.g).toBe('number');
    expect(typeof item.b).toBe('number');
  });
});
