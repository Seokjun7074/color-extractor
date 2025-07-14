import { useEffect, useState } from 'react';

export const useImageUpload = () => {
  const [imageURL, setImage] = useState<string | undefined>(undefined);

  const getFileByEvent = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
  ): File | undefined => {
    let file: File | undefined;

    if ('dataTransfer' in e) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        file = e.dataTransfer.files[0];
      }
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file = target.files[0];
      }
    }
    return file ?? undefined;
  };

  const saveImgFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    const file = getFileByEvent(e);

    if (!file) return;
    cleanUpImageURL(imageURL);

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const cleanUpImageURL = (currentImage: string | undefined) => {
    if (currentImage) {
      URL.revokeObjectURL(currentImage);
    }
  };

  useEffect(() => {
    return () => cleanUpImageURL(imageURL);
  }, [imageURL]);

  return { imageURL, saveImgFile };
};
