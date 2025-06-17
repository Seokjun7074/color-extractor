import { rgbToHex } from '@/utils/colorConverter';
import { useCallback, useEffect, useRef } from 'react';

export const useCanvasImage = () => {
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

  const splitPixelRGBA = useCallback((rgbaList: Uint8ClampedArray<ArrayBufferLike>) => {
    const allPixelRGBA = [];

    for (let i = 0; i < rgbaList.length; i += 4) {
      const r = rgbaList[i];
      const g = rgbaList[i + 1];
      const b = rgbaList[i + 2];
      const a = rgbaList[i + 3];
      allPixelRGBA.push([r, g, b, a]);
    }
    return allPixelRGBA;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    }
  }, []);

  return { canvasRef, ctxRef, setImageToCanvas, pickColor };
};
