'use client';

import { useColorExtractProcess } from '@/domains/extract/hooks/useColorExtractProcess';
import ExtractedColor from '@/domains/extract/components/ExtractedColor';
import { DragAndDropBox } from '@/components/DragAndDropBox';

export default function ExtractPage() {
  const { canvasRef, saveImgFile, colors, isLoading } = useColorExtractProcess();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex w-sm flex-col gap-4 p-4">
        <canvas className="rounded-md border-1 border-gray-400" ref={canvasRef}></canvas>
        <DragAndDropBox onImageDrop={saveImgFile} />
        <ExtractedColor colors={colors} isLoading={isLoading} />
      </div>
    </div>
  );
}
