import { useEffect, useState } from 'react';

export const useImageUpload = () => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

  const [imageURL, setImage] = useState<string | undefined>(undefined);

  const isImageFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return file.type.startsWith('image/') && extension && imageExtensions.includes(extension);
  };

  const saveImgFile = (file: File) => {
    if (!isImageFile(file)) {
      alert('이미지만 업로드 가능합니다.');
      return;
    }

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
