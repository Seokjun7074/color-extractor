'use client';

import { useEffect, useRef, useState } from 'react';

export default function ExtractPage() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
        console.log(image);
      }
    };
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <input className="hidden" type="file" accept="image/*" ref={imageRef} onChange={saveImgFile} />
      <button
        className="bg-primary hover:bg-primary-hover w-sm rounded-md p-2 text-sm text-white"
        onClick={clickImageInput}
      >
        사진 추가하기
      </button>
      <canvas className="h-auto w-sm bg-blue-100" ref={canvasRef}></canvas>
    </div>
  );
}
