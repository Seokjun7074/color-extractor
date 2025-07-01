'use client';

import ImageUploadButton from '@/domains/extract/components/ImageUploadButton';
import { useCanvasImage } from '@/domains/extract/hooks/useCanvasImage';
import { useClusteredColor } from '@/domains/extract/hooks/useClusteredColor';
import { useImageUpload } from '@/domains/extract/hooks/useImageUpload';
import { kMeans } from '@/utils/kMeans';
import { useEffect } from 'react';

export default function ExtractPage() {
  const { imageURL, saveImgFile } = useImageUpload();
  const { canvasRef, setImageToCanvas, getPixelImageData, getContextImageData } = useCanvasImage();
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
        <div className="flex justify-around gap-1">
          {colors.map((item) => (
            <div
              key={item}
              className="h-10 w-10 rounded-md border-1 border-gray-600"
              style={{ backgroundColor: item }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
