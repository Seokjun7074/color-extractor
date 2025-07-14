import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { ReactNode, useRef } from 'react';

interface Prop {
  onImageDrop: (file: File) => void;
  children?: ReactNode;
}

export const DragAndDropBox = ({ onImageDrop, children }: Prop) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop } = useDragAndDrop();

  const clickImageInput = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageDrop(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <input className="hidden" type="file" accept="image/*" ref={imageInputRef} onChange={handleInputChange} />
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md p-4 text-white transition-colors ${isDragging ? 'bg-blue-300' : 'bg-primary'}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={handleDrop}
        onClick={clickImageInput}
      >
        <span>Upload</span>
        {children}
      </div>
    </>
  );
};
