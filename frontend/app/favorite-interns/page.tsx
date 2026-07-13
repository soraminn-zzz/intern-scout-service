"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Intern, getFavoriteInterns, getSavedAuth, unfavoriteIntern } from "@/lib/api";

const t = {
  back: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7",
  title: "\u304a\u6c17\u306b\u5165\u308a\u30a4\u30f3\u30bf\u30fc\u30f3\u751f",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  empty: "\u304a\u6c17\u306b\u5165\u308a\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002",
  failed: "\u304a\u6c17\u306b\u5165\u308a\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  remove: "\u89e3\u9664",
  detail: "\u8a73\u7d30",
  skills: "\u30b9\u30ad\u30eb",
  unset: "\u672a\u8a2d\u5b9a",
};

export default function FavoriteInternsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [interns, setInterns] = useState<Intern[]>([]);
  const [message, setMessage] = useState(t.loading);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();
      if (!auth) {
        router.replace("/login");
        return;
      }
      setToken(auth.token);
      getFavoriteInterns(auth.token)
        .then((data) => {
          setInterns(data.interns);
          setMessage(data.interns.length === 0 ? t.empty : "");
        })
        .catch(() => setMessage(t.failed));
    });
  }, [router]);

  async function handleRemove(internId: number) {
    await unfavoriteIntern(token, internId);
    setInterns((current) => current.filter((intern) => intern.id !== internId));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link className="text-sm font-medium text-slate-600" href="/interns">{t.back}</Link>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
        </section>
        {message && <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
        <section className="grid gap-4 md:grid-cols-2">
          {interns.map((intern) => (
            <article key={intern.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{intern.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{intern.email}</p>
              <p className="mt-4 text-sm text-slate-600">{t.skills}: {intern.profile?.skills || t.unset}</p>
              <div className="mt-5 flex gap-2">
                <Link className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white" href={`/interns/${intern.id}`}>{t.detail}</Link>
                <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700" onClick={() => handleRemove(intern.id)} type="button">{t.remove}</button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
