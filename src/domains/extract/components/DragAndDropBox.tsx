import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useRef } from 'react';

interface Prop {
  saveImgFile: (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => void;
}

export const DragAndDropBox = ({ saveImgFile }: Prop) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop } = useDragAndDrop();

  const clickImageInput = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const DropToSaveImage = (e: React.DragEvent<HTMLDivElement>) => {
    saveImgFile(e);
    onDrop(e);
  };

  return (
    <>
      <input className="hidden" type="file" accept="image/*" ref={imageInputRef} onChange={saveImgFile} />
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md p-4 text-white transition-colors ${isDragging ? 'bg-blue-300' : 'bg-primary'}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={DropToSaveImage}
        onClick={clickImageInput}
      >
        <span>Upload</span>
      </div>
    </>
  );
};
