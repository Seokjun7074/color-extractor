import { useCanvasContext } from '@/domains/extract/hooks/useCanvasContext';
import { useCanvasImage } from '@/domains/extract/hooks/useCanvasImage';
import { useCanvasPixelData } from '@/domains/extract/hooks/useCanvasPixelData';
import { useClusteredColor } from '@/domains/extract/hooks/useClusteredColor';
import { useImageUpload } from '@/domains/extract/hooks/useImageUpload';
import { useKmeansWorker } from '@/domains/extract/hooks/useKmeansWorker';

import { useEffect, useState } from 'react';

const KMEANS_WEIGHT = 6;

export function useColorExtractProcess() {
  const [isLoading, setIsLoading] = useState(false);
  const { canvasRef, ctxRef } = useCanvasContext();
  const { imageURL, saveImgFile } = useImageUpload();
  const { setImageToCanvas } = useCanvasImage(canvasRef, ctxRef);
  const { getContextImageData } = useCanvasPixelData(canvasRef, ctxRef);
  const { colors, setClusteredHex } = useClusteredColor();
  const { extractByKmeans } = useKmeansWorker();

  useEffect(() => {
    if (!imageURL) return;

    const process = async () => {
      setIsLoading(true);
      await setImageToCanvas(imageURL);
      const allPixelData = await getContextImageData(imageURL);
      if (allPixelData.length > 0) {
        const result = await extractByKmeans(allPixelData, KMEANS_WEIGHT);
        setIsLoading(false);
        setClusteredHex(result);
      }
    };

    process();
  }, [imageURL]);

  return {
    canvasRef,
    saveImgFile,
    colors,
    isLoading,
  };
}
