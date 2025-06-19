'use client';

import ImageUploadButton from '@/domains/extract/components/ImageUploadButton';
import { useCanvasImage } from '@/domains/extract/hooks/useCanvasImage';
import { useImageUpload } from '@/domains/extract/hooks/useImageUpload';
import { useEffect } from 'react';

export default function ExtractPage() {
  const { imageURL, saveImgFile } = useImageUpload();
  const { canvasRef, setImageToCanvas, getPixelImageData, getContextImageData } = useCanvasImage();

  useEffect(() => {
    if (!imageURL) return;

    const initCanvasImage = async (imageURL: string) => {
      await setImageToCanvas(imageURL);
      getContextImageData();
    };

    initCanvasImage(imageURL);
  }, [imageURL]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <ImageUploadButton saveImgFile={saveImgFile} />
      <canvas className="h-auto w-sm bg-blue-100" ref={canvasRef} onClick={getPixelImageData}></canvas>
    </div>
  );
}
