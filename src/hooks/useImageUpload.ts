import { useEffect, useState } from 'react';

export const useImageUpload = () => {
  const [imageURL, setImage] = useState<string | undefined>(undefined);

  const saveImgFile = (file: File) => {
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
