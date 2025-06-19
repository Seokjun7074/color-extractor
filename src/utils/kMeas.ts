import { RGBProp } from '@/types/color';

export const kMeans = (pixels: RGBProp[], k: number): RGBProp[] => {
  // 초기 중심점 랜덤 선택
  let centroids = pixels.sort(() => Math.random() - 0.5).slice(0, k);

  let oldCentroids: typeof centroids = [];
  let iterations = 0;
  const maxIterations = 100;

  while (!areEqual(centroids, oldCentroids) && iterations < maxIterations) {
    oldCentroids = [...centroids];

    // 각 픽셀을 가장 가까운 중심점에 할당
    const clusters = pixels.map((pixel) => {
      const distances = centroids.map((centroid) =>
        Math.sqrt(
          Math.pow(pixel.r - centroid.r, 2) + Math.pow(pixel.g - centroid.g, 2) + Math.pow(pixel.b - centroid.b, 2),
        ),
      );
      return distances.indexOf(Math.min(...distances));
    });

    // 새로운 중심점 계산
    centroids = centroids.map((_, i) => {
      const clusterPixels = pixels.filter((_, j) => clusters[j] === i);
      if (clusterPixels.length === 0) return centroids[i];

      return {
        r: Math.round(clusterPixels.reduce((sum, p) => sum + p.r, 0) / clusterPixels.length),
        g: Math.round(clusterPixels.reduce((sum, p) => sum + p.g, 0) / clusterPixels.length),
        b: Math.round(clusterPixels.reduce((sum, p) => sum + p.b, 0) / clusterPixels.length),
      };
    });

    iterations++;
  }

  return centroids;
};

const areEqual = (a: RGBProp[], b: RGBProp[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].r !== b[i].r || a[i].g !== b[i].g || a[i].b !== b[i].b) {
      return false;
    }
  }
  return true;
};
