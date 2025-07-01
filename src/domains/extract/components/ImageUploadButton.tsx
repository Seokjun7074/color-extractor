import { useRef } from 'react';

interface Prop {
  saveImgFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadButton({ saveImgFile }: Prop) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const clickImageInput = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  return (
    <>
      <input className="hidden" type="file" accept="image/*" ref={imageInputRef} onChange={saveImgFile} />
      <button
        className="bg-primary hover:bg-primary-hover w-full rounded-md p-2 text-sm text-white"
        onClick={clickImageInput}
      >
        사진 추가하기
      </button>
    </>
  );
}
