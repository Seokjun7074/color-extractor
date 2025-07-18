interface Props {
  colors: string[];
  isLoading: boolean;
}

export default function ExtractedColor({ colors, isLoading }: Props) {
  const copyHexCode = async (hexCode: string) => {
    await window.navigator.clipboard.writeText(hexCode);
    alert(`${hexCode}가 복사되었습니다.`);
  };

  return (
    <div className="flex h-10 w-full justify-between gap-1">
      {isLoading && <div className="h-10 animate-pulse">loading..</div>}
      {colors.map((item) => (
        <div key={item} className="group relative">
          <div
            className="h-12 w-12 cursor-pointer rounded-md border-1 border-gray-500 select-none"
            style={{ backgroundColor: item }}
            onClick={() => copyHexCode(item)}
          />
          <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-3 w-max -translate-x-1/2 scale-0 rounded-sm bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            {item}
          </div>
        </div>
      ))}
    </div>
  );
}
