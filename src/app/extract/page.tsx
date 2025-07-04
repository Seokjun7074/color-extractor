'use client';

import { useColorExtractProcess } from '@/domains/extract/hooks/useColorExtractProcess';
import ExtractedColor from '@/domains/extract/components/ExtractedColor';
import ImageUploadButton from '@/domains/extract/components/ImageUploadButton';
import { useEffect } from 'react';

export default function ExtractPage() {
  const { canvasRef, saveImgFile, colors } = useColorExtractProcess();

  useEffect(() => {
    const worker = new Worker(new URL('/worker.ts', import.meta.url));

    worker.postMessage(10);

    worker.onmessage = (e) => {
      console.log('워커 결과:', e.data);
    };
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex w-sm flex-col gap-4">
        <canvas className="w-full rounded-md border-1 border-gray-400" ref={canvasRef}></canvas>
        <ImageUploadButton saveImgFile={saveImgFile} />
        <ExtractedColor colors={colors} />
      </div>
    </div>
  );
}
