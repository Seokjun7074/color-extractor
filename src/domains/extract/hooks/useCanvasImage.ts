export const useCanvasImage = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  const getImageSize = (img: HTMLImageElement) => {
    const maxWidth = 500;
    const maxHeight = 500;
    // 원본 비율 계산
    const ratio = img.width / img.height;
    // 새 크기 계산
    let newWidth = img.width;
    let newHeight = img.height;

    if (img.width > maxWidth) {
      newWidth = maxWidth;
      newHeight = Math.round(maxWidth / ratio);
    }
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = Math.round(maxHeight * ratio);
    }

    return { newWidth, newHeight };
  };

  const setImageToCanvas = (imageURL: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageURL;

      img.onload = () => {
        if (!canvasRef.current || !ctxRef.current) return reject('canvas or ctx is null');
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        const { newWidth, newHeight } = getImageSize(img);
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve();
      };
      img.onerror = reject;
    });
  };

  return { setImageToCanvas };
};
