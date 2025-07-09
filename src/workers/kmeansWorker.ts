import { kMeans } from '@/utils/kMeans';

onmessage = (e) => {
  const { allPixelData, KMEANS_WEIGHT } = e.data;
  try {
    const result = kMeans(allPixelData, KMEANS_WEIGHT);

    postMessage({
      isSuccess: true,
      result,
    });
  } catch (e) {
    console.error(e);
    postMessage({
      isSuccess: false,
      result: undefined,
    });
  }
};
