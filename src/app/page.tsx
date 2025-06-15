import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link href="extract">시작하기</Link>
    </div>
  );
}
