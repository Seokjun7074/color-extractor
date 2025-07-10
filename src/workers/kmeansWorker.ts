import { RGBProp } from '@/types/color';
import { labToRgb, rgbToLab } from '@/utils/colorConverter';
import { kMeans } from '@/utils/kMeans';

onmessage = (e) => {
  const { allPixelData, KMEANS_WEIGHT } = e.data;
  try {
    const labColors = allPixelData.map((color: RGBProp) => rgbToLab(color));
    const result = kMeans(labColors, KMEANS_WEIGHT).map((color) => labToRgb(color));

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
