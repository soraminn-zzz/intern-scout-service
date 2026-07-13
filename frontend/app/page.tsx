import Link from "next/link";

const t = {
  login: "\u30ed\u30b0\u30a4\u30f3",
  register: "\u767b\u9332",
  serviceName: "\u30a4\u30f3\u30bf\u30fc\u30f3\u30b9\u30ab\u30a6\u30c8",
  title: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u3068\u4f01\u696d\u3092\u3064\u306a\u3050\u30b9\u30ab\u30a6\u30c8\u30b5\u30fc\u30d3\u30b9",
  description:
    "\u30a2\u30ab\u30a6\u30f3\u30c8\u767b\u9332\u3001\u30ed\u30b0\u30a4\u30f3\u3001\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3001\u4f01\u696d\u304b\u3089\u306e\u30b9\u30ab\u30a6\u30c8\u30e1\u30c3\u30bb\u30fc\u30b8\u9001\u4fe1\u307e\u3067\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002",
  dashboard: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  internTitle: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u306e\u65b9",
  internDesc: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u767b\u9332\u3057\u3066\u3001\u4f01\u696d\u304b\u3089\u306e\u30b9\u30ab\u30a6\u30c8\u3092\u53d7\u3051\u53d6\u308c\u307e\u3059\u3002",
  companyTitle: "\u4f01\u696d\u306e\u65b9",
  companyDesc: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u3092\u63a2\u3057\u3066\u3001\u30e1\u30c3\u30bb\u30fc\u30b8\u3084\u52df\u96c6\u63b2\u8f09\u304c\u3067\u304d\u307e\u3059\u3002",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <header className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Scout</span>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link className="text-slate-600" href="/login">
              {t.login}
            </Link>
            <Link className="rounded-md bg-emerald-700 px-4 py-2 text-white" href="/register">
              {t.register}
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-700">{t.serviceName}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {t.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="rounded-md bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white" href="/register">
                {t.register}
              </Link>
              <Link className="rounded-md border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800" href="/dashboard">
                {t.dashboard}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{t.internTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.internDesc}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{t.companyTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.companyDesc}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
