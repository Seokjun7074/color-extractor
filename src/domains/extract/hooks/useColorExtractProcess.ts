import { useCanvasContext } from '@/domains/extract/hooks/useCanvasContext';
import { useCanvasImage } from '@/domains/extract/hooks/useCanvasImage';
import { useCanvasPixelData } from '@/domains/extract/hooks/useCanvasPixelData';
import { useClusteredColor } from '@/domains/extract/hooks/useClusteredColor';
import { useImageUpload } from '@/domains/extract/hooks/useImageUpload';
import { RGBProp } from '@/types/color';

import { useEffect } from 'react';

const KMEANS_WEIGHT = 6;

export function useColorExtractProcess() {
  const { canvasRef, ctxRef } = useCanvasContext();
  const { imageURL, saveImgFile } = useImageUpload();
  const { setImageToCanvas } = useCanvasImage(canvasRef, ctxRef);
  const { getContextImageData, getClickedPixelImageData } = useCanvasPixelData(canvasRef, ctxRef);
  const { colors, setClusteredHex } = useClusteredColor();

  const extractByKmeans = (allPixelData: RGBProp[], KMEANS_WEIGHT: number) => {
    const kmeansWorker = new Worker(new URL('/src/workers/kmeansWorker.ts', import.meta.url));
    kmeansWorker.postMessage({ allPixelData, KMEANS_WEIGHT });
    kmeansWorker.onmessage = (e) => {
      const { isSuccess, result } = e.data;
      if (isSuccess) {
        setClusteredHex(result);
        kmeansWorker.terminate();
      }
    };
  };

  useEffect(() => {
    if (!imageURL) return;

    const process = async () => {
      await setImageToCanvas(imageURL);
      const allPixelData = await getContextImageData(imageURL);
      if (allPixelData.length > 0) {
        extractByKmeans(allPixelData, KMEANS_WEIGHT);
      }
    };

    process();
  }, [imageURL]);

  return {
    canvasRef,
    getClickedPixelImageData, // 지금은 사용하지 않음
    saveImgFile,
    colors,
  };
}
