'use client';

import ExtractedColor from '@/domains/extract/components/ExtractedColor';
import ImageUploadButton from '@/domains/extract/components/ImageUploadButton';
import { useCanvasContext } from '@/domains/extract/hooks/useCanvasContext';
import { useCanvasImage } from '@/domains/extract/hooks/useCanvasImage';
import { useCanvasPixelData } from '@/domains/extract/hooks/useCanvasPixelData';
import { useClusteredColor } from '@/domains/extract/hooks/useClusteredColor';
import { useImageUpload } from '@/domains/extract/hooks/useImageUpload';
import { kMeans } from '@/utils/kMeans';
import { useEffect } from 'react';

export default function ExtractPage() {
  const { canvasRef, ctxRef } = useCanvasContext();

  const { imageURL, saveImgFile } = useImageUpload();
  const { setImageToCanvas } = useCanvasImage(canvasRef, ctxRef);
  const { getContextImageData, getPixelImageData } = useCanvasPixelData(canvasRef, ctxRef);
  const { colors, setClusteredHex } = useClusteredColor();

  useEffect(() => {
    if (!imageURL) return;

    const initCanvasImage = async (imageURL: string) => {
      await setImageToCanvas(imageURL);
      const allPixelData = getContextImageData();
      if (allPixelData) {
        const clusteredData = kMeans(allPixelData, 6);
        setClusteredHex(clusteredData);
      }
    };

    initCanvasImage(imageURL);
  }, [imageURL]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex w-sm flex-col gap-4">
        <canvas
          className="w-full rounded-md border-1 border-gray-400"
          ref={canvasRef}
          onClick={getPixelImageData}
        ></canvas>
        <ImageUploadButton saveImgFile={saveImgFile} />
        <ExtractedColor colors={colors} />
      </div>
    </div>
  );
}
