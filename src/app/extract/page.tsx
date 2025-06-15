'use client';

import { rgbToHex } from '@/utils/colorConverter';
import { useEffect, useRef, useState } from 'react';

export default function ExtractPage() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string>('#000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const saveImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    setImageToCanvas(imageURL);
  };

  const setImageToCanvas = (imageURL: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 캔버스 크기 설정 (이미지 크기에 맞게)
      canvas.width = img.width;
      canvas.height = img.height;

      // 이미지 그리기
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageURL;
  };

  const clickImageInput = () => {
    if (!imageRef.current) return;
    imageRef.current.click();
  };

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hexColor = getHexColor(canvas, e.clientX, e.clientY);
    console.log(hexColor);
    setColor(hexColor);
  };

  const getHexColor = (canvas: HTMLCanvasElement, clientX: number, clientY: number): string => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '';

    const bounding = canvas.getBoundingClientRect();
    console.log(canvas.width, bounding.width);
    const scaleX = canvas.width / bounding.width; // 사진의 실제 해상도 / 뷰포트상 길이
    const scaleY = canvas.height / bounding.height;

    const x = Math.floor((clientX - bounding.left) * scaleX);
    const y = Math.floor((clientY - bounding.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;
    const hexColor = rgbToHex(data[0], data[1], data[2]);
    return hexColor;
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <input className="hidden" type="file" accept="image/*" ref={imageRef} onChange={saveImgFile} />
      <button
        className="bg-primary hover:bg-primary-hover w-sm rounded-md p-2 text-sm text-white"
        onClick={clickImageInput}
      >
        사진 추가하기
      </button>
      <canvas className="h-auto w-sm bg-blue-100" ref={canvasRef} onClick={pickColor}></canvas>
      <div className="rounded-full border-1 p-2 text-white" style={{ backgroundColor: color }}>
        색상
      </div>
    </div>
  );
}
