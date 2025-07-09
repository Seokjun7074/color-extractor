interface Props {
  colors: string[];
  isLoading: boolean;
}

export default function ExtractedColor({ colors, isLoading }: Props) {
  return (
    <div className="flex h-10 w-full justify-around gap-1">
      {isLoading && <div className="h-10 animate-pulse">loading..</div>}
      {colors.map((item) => (
        <div key={item} className="h-10 w-10 rounded-md border-1 border-gray-600" style={{ backgroundColor: item }} />
      ))}
    </div>
  );
}
