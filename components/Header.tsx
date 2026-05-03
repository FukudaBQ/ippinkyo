import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 shadow-[0_1px_6px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="max-w-page mx-auto px-5 py-3 flex items-center justify-between md:px-5">
        <Link href="/" className="font-serif text-[22px] font-bold text-brand tracking-wide2 leading-tight md:text-[22px]">
          逸品居
          <span className="block text-[12px] font-normal text-neutral-500 tracking-wide3">中華料理</span>
        </Link>
        <nav className="flex items-center">
          <Link
            href="/menu/"
            className="text-[13px] text-neutral-700 ml-6 tracking-[0.05em] hover:text-brand transition-colors md:ml-6"
          >
            メニュー
          </Link>
          <Link
            href="/#access"
            className="text-[13px] text-neutral-700 ml-6 tracking-[0.05em] hover:text-brand transition-colors"
          >
            アクセス
          </Link>
        </nav>
      </div>
    </header>
  );
}
