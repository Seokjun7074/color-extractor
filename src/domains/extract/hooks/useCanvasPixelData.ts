import { RGBProp } from '@/types/color';

export const useCanvasPixelData = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  /**
   * Canvas 전체 영역 픽셀들의 RGBA값을 반환합니다.
   */
  const getContextImageData = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    const allPixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = splitPixelRGBA(allPixelData.data);
    // console.log(splitPixelRGBA(allPixelData.data));
    return data;
  };

  /**
   * 현재 클릭한 Canvas 좌표의 RGBA값을 반환 합니다.
   */
  const getClickedPixelImageData = (e: React.MouseEvent<HTMLCanvasElement>): RGBProp | undefined => {
    if (!ctxRef.current || !canvasRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    const bounding = canvas.getBoundingClientRect();
    const scaleX = canvas.width / bounding.width; // 사진의 실제 해상도 / 뷰포트상 길이
    const scaleY = canvas.height / bounding.height;

    const x = Math.floor((e.clientX - bounding.left) * scaleX);
    const y = Math.floor((e.clientY - bounding.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1);

    const data = pixel.data;
    console.log('This pixel data', [data[0], data[1], data[2]]);
    return { r: data[0], g: data[1], b: data[2] };
  };

  /**
   * RGBA값만 배열에 담아 반환합니다.
   */
  const splitPixelRGBA = (rgbaList: Uint8ClampedArray<ArrayBufferLike>): RGBProp[] => {
    const allRGBAList: RGBProp[] = [];

    for (let i = 0; i < rgbaList.length; i += 4) {
      const r = rgbaList[i];
      const g = rgbaList[i + 1];
      const b = rgbaList[i + 2];
      allRGBAList.push({ r, g, b });
    }
    return allRGBAList;
  };

  return { getContextImageData, getClickedPixelImageData };
};
