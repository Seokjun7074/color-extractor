import { RGBProp } from '@/types/color';

export const useKmeansWorker = () => {
  const extractByKmeans = async (allPixelData: RGBProp[], KMEANS_WEIGHT: number): Promise<RGBProp[]> => {
    return new Promise((resolve, reject) => {
      const kmeansWorker = new Worker(new URL('/src/workers/kmeansWorker.ts', import.meta.url));
      kmeansWorker.postMessage({ allPixelData, KMEANS_WEIGHT });
      kmeansWorker.onmessage = (e) => {
        const { isSuccess, result } = e.data;

        if (isSuccess) {
          resolve(result);
        } else {
          reject(new Error('K-means 알고리즘 오류'));
        }
        kmeansWorker.terminate();
      };
    });
  };

  return { extractByKmeans };
};
