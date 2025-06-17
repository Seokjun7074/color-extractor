'use client';

import { useImageUpload } from '@/app/extract/hooks/useImageUpload';
import { rgbToHex } from '@/utils/colorConverter';
import { useEffect, useRef } from 'react';

export default function ExtractPage() {
  const { imageURL, saveImgFile } = useImageUpload();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const setImageToCanvas = (imageURL: string) => {
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current || !ctxRef.current) return;
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      // 캔버스 크기 설정 (이미지 크기에 맞게)
      canvas.width = img.width;
      canvas.height = img.height;

      // 이미지 그리기
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageURL;
  };

  const clickImageInput = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
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
      <input className="hidden" type="file" accept="image/*" ref={imageInputRef} onChange={saveImgFile} />
      <button
        className="bg-primary hover:bg-primary-hover w-sm rounded-md p-2 text-sm text-white"
        onClick={clickImageInput}
      >
        사진 추가하기
      </button>
      <canvas className="h-auto w-sm bg-blue-100" ref={canvasRef} onClick={pickColor}></canvas>
    </div>
  );
}
