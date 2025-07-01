'use client';

import ImageUploadButton from '@/domains/extract/components/ImageUploadButton';
import { useCanvasImage } from '@/domains/extract/hooks/useCanvasImage';
import { useCanvasPixelData } from '@/domains/extract/hooks/useCanvasPixelData';
import { useClusteredColor } from '@/domains/extract/hooks/useClusteredColor';
import { useImageUpload } from '@/domains/extract/hooks/useImageUpload';
import { kMeans } from '@/utils/kMeans';
import { useEffect, useRef } from 'react';

export default function ExtractPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    }
  }, []);

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
