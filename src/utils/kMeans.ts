import { LABProp } from '@/types/color';

export const kMeans = (pixels: LABProp[], k: number): LABProp[] => {
  // K-means++로 중심점 초기화
  let centroids = kMeansPlusPlusInit(pixels, k);

  let oldCentroids: typeof centroids = [];
  let iterations = 0;
  const maxIterations = 100;

  while (!areEqual(centroids, oldCentroids) && iterations < maxIterations) {
    oldCentroids = [...centroids];

    // 각 픽셀을 가장 가까운 중심점에 할당
    const clusters = pixels.map((pixel) => {
      const distances = centroids.map((centroid) => getDistance(pixel, centroid));
      return distances.indexOf(Math.min(...distances));
    });

    // 새로운 중심점 계산
    centroids = centroids.map((_, i) => {
      const clusterPixels = pixels.filter((_, j) => clusters[j] === i);
      if (clusterPixels.length === 0) return centroids[i];

      return {
        l: Math.round(clusterPixels.reduce((sum, p) => sum + p.l, 0) / clusterPixels.length),
        a: Math.round(clusterPixels.reduce((sum, p) => sum + p.a, 0) / clusterPixels.length),
        b: Math.round(clusterPixels.reduce((sum, p) => sum + p.b, 0) / clusterPixels.length),
      };
    });

    iterations++;
  }

  return centroids;
};

const getDistance = (a: LABProp, b: LABProp): number => {
  return Math.sqrt(Math.pow(a.l - b.l, 2) + Math.pow(a.a - b.a, 2) + Math.pow(a.b - b.b, 2));
};

const areEqual = (a: LABProp[], b: LABProp[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].l !== b[i].l || a[i].a !== b[i].a || a[i].b !== b[i].b) {
      return false;
    }
  }
  return true;
};

const kMeansPlusPlusInit = (pixels: LABProp[], k: number): LABProp[] => {
  const centroids: LABProp[] = [];

  // 첫 번째 중심점은 랜덤 선택
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);

  while (centroids.length < k) {
    const distances = pixels.map((pixel) => {
      const minDist = Math.min(...centroids.map((c) => getDistance(pixel, c)));
      return minDist ** 2; // 거리의 제곱
    });

    const sum = distances.reduce((a, b) => a + b, 0);
    const probabilities = distances.map((d) => d / sum);

    // 누적 분포 생성
    const cumulative: number[] = [];
    probabilities.reduce((acc, prob, i) => {
      cumulative[i] = acc + prob;
      return cumulative[i];
    }, 0);

    // 0~1 사이의 랜덤 값에 따라 다음 중심점 선택
    const rand = Math.random();
    const nextIndex = cumulative.findIndex((cum) => rand < cum);
    centroids.push(pixels[nextIndex]);
  }

  return centroids;
};
