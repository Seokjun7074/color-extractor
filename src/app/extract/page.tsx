'use client';

import ImageUploadButton from '@/app/extract/components/ImageUploadButton';
import { useImageUpload } from '@/app/extract/hooks/useImageUpload';
import { rgbToHex } from '@/utils/colorConverter';
import { useEffect, useRef } from 'react';

export default function ExtractPage() {
  const { imageURL, saveImgFile } = useImageUpload();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const setImageToCanvas = (imageURL: string) => {
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current || !ctxRef.current) return;
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
    };
    img.src = imageURL;
  };

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const hexColor = getHexColor(canvas, e.clientX, e.clientY);
    console.log(hexColor);
  };

  const getHexColor = (canvas: HTMLCanvasElement, clientX: number, clientY: number): string => {
    if (!ctxRef.current) return '';
    const ctx = ctxRef.current;

    const pixel = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = pixel.data;
    console.log(splitPixelRGBA(data)[0]);
    const hexColor = rgbToHex(data[0], data[1], data[2]);
    return hexColor;
  };

  const splitPixelRGBA = (rgbaList: Uint8ClampedArray<ArrayBufferLike>) => {
    const allPixelRGBA = [];

    for (let i = 0; i < rgbaList.length; i += 4) {
      const r = rgbaList[i];
      const g = rgbaList[i + 1];
      const b = rgbaList[i + 2];
      const a = rgbaList[i + 3];
      allPixelRGBA.push([r, g, b, a]);
    }
    return allPixelRGBA;
  };

  useEffect(() => {
    if (imageURL) {
      setImageToCanvas(imageURL);
    }
  }, [imageURL]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    }
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <ImageUploadButton saveImgFile={saveImgFile} />
      <canvas className="h-auto w-sm bg-blue-100" ref={canvasRef} onClick={pickColor}></canvas>
    </div>
  );
}
