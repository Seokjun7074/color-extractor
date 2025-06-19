import { useEffect, useRef } from 'react';

export const useCanvasImage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const setImageToCanvas = (imageURL: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageURL;

      img.onload = () => {
        if (!canvasRef.current || !ctxRef.current) return reject('canvas or ctx is null');
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve();
      };
      img.onerror = reject;
    });
  };
  /**
   * Canvas 전체 영역 픽셀들의 RGBA값을 반환합니다.
   */
  const getContextImageData = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    const allPixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // console.log(splitPixelRGBA(allPixelData.data));
    return allPixelData.data;
  };

  /**
   * 현재 클릭한 Canvas 좌표의 RGBA값을 반환 합니다.
   */
  const getPixelImageData = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current || !canvasRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    const bounding = canvas.getBoundingClientRect();
    const scaleX = canvas.width / bounding.width; // 사진의 실제 해상도 / 뷰포트상 길이
    const scaleY = canvas.height / bounding.height;

    const x = Math.floor((e.clientX - bounding.left) * scaleX);
    const y = Math.floor((e.clientY - bounding.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1);

    const data = pixel.data;
    console.log('This pixel data', data);
    return data;
  };

  /**
   * RGBA값만 배열에 담아 반환합니다.
   */
  const splitPixelRGBA = (rgbaList: Uint8ClampedArray<ArrayBufferLike>) => {
    const allRGBAList = [];

    for (let i = 0; i < rgbaList.length; i += 4) {
      const r = rgbaList[i];
      const g = rgbaList[i + 1];
      const b = rgbaList[i + 2];
      const a = rgbaList[i + 3];
      allRGBAList.push([r, g, b, a]);
    }
    return allRGBAList;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    }
  }, []);

  return { canvasRef, ctxRef, setImageToCanvas, getPixelImageData, getContextImageData };
};
