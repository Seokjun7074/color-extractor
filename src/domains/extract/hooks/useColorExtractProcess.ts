import { useCanvasContext } from './useCanvasContext';
import { useCanvasImage } from './useCanvasImage';
import { useCanvasPixelData } from './useCanvasPixelData';
import { useClusteredColor } from './useClusteredColor';
import { useImageUpload } from './useImageUpload';
import { kMeans } from '@/utils/kMeans';
import { useEffect } from 'react';

export function useColorExtractProcess() {
  const { canvasRef, ctxRef } = useCanvasContext();
  const { imageURL, saveImgFile } = useImageUpload();
  const { setImageToCanvas } = useCanvasImage(canvasRef, ctxRef);
  const { getContextImageData, getPixelImageData } = useCanvasPixelData(canvasRef, ctxRef);
  const { colors, setClusteredHex } = useClusteredColor();

  useEffect(() => {
    if (!imageURL) return;

    const process = async () => {
      await setImageToCanvas(imageURL);
      const allPixelData = getContextImageData();
      if (allPixelData) {
        const clusteredData = kMeans(allPixelData, 6);
        setClusteredHex(clusteredData);
      }
    };

    process();
  }, [imageURL]);

  return {
    canvasRef,
    getPixelImageData,
    saveImgFile,
    colors,
  };
}
