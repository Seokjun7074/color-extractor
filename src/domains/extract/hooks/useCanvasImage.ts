export const useCanvasImage = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  const setImageToCanvas = (imageURL: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageURL;

      img.onload = () => {
        if (!canvasRef.current || !ctxRef.current) return reject('canvas or ctx is null');
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      img.onerror = reject;
    });
  };

  return { setImageToCanvas };
};
