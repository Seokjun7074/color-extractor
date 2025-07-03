export default function ExtractedColor({ colors }: { colors: string[] }) {
  return (
    <div className="flex justify-around gap-1">
      {colors.map((item) => (
        <div key={item} className="h-10 w-10 rounded-md border-1 border-gray-600" style={{ backgroundColor: item }} />
      ))}
    </div>
  );
}
