"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Intern,
  favoriteIntern,
  getInterns,
  getSavedAuth,
  unfavoriteIntern,
} from "@/lib/api";

const t = {
  dashboard: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  title: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7",
  lead: "\u6c17\u306b\u306a\u308b\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u3092\u304a\u6c17\u306b\u5165\u308a\u306b\u4fdd\u5b58\u3067\u304d\u307e\u3059\u3002",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  forbidden: "\u4f01\u696d\u30e6\u30fc\u30b6\u30fc\u306e\u307f\u5229\u7528\u3067\u304d\u307e\u3059\u3002",
  empty: "\u8868\u793a\u3067\u304d\u308b\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u304c\u307e\u3060\u3044\u307e\u305b\u3093\u3002",
  school: "\u5b66\u6821",
  skills: "\u30b9\u30ad\u30eb",
  position: "\u5e0c\u671b\u8077\u7a2e",
  detail: "\u8a73\u7d30",
  favorite: "\u304a\u6c17\u306b\u5165\u308a",
  favorited: "\u4fdd\u5b58\u6e08\u307f",
  failed: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  unset: "\u672a\u8a2d\u5b9a",
};

export default function InternsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [interns, setInterns] = useState<Intern[]>([]);
  const [message, setMessage] = useState(t.loading);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      if (auth.user.role !== "company") {
        setIsForbidden(true);
        setMessage(t.forbidden);
        return;
      }

      setToken(auth.token);
      getInterns(auth.token)
        .then((data) => {
          setInterns(data.interns);
          setMessage(data.interns.length === 0 ? t.empty : "");
        })
        .catch(() => setMessage(t.failed));
    });
  }, [router]);

  async function handleToggleFavorite(intern: Intern) {
    if (!token) return;

    if (intern.is_favorited) {
      await unfavoriteIntern(token, intern.id);
    } else {
      await favoriteIntern(token, intern.id);
    }

    setInterns((current) =>
      current.map((item) =>
        item.id === intern.id ? { ...item, is_favorited: !item.is_favorited } : item,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/dashboard">
            {t.dashboard}
          </Link>
          <Link className="text-sm font-semibold text-emerald-700" href="/favorite-interns">
            {t.favorited}
          </Link>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>
        </section>

        {message && (
          <p className={`rounded-md px-3 py-2 text-sm ${isForbidden ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}>
            {message}
          </p>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {interns.map((intern) => (
            <article key={intern.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{intern.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{intern.email}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className={`rounded-md px-3 py-2 text-sm font-semibold ${intern.is_favorited ? "bg-emerald-50 text-emerald-700" : "border border-slate-300 text-slate-700"}`} onClick={() => handleToggleFavorite(intern)} type="button">
                    {intern.is_favorited ? t.favorited : t.favorite}
                  </button>
                  <Link className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white" href={`/interns/${intern.id}`}>
                    {t.detail}
                  </Link>
                </div>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-900">{t.school}</dt>
                  <dd className="mt-1 text-slate-600">{intern.profile?.school_name || t.unset}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">{t.skills}</dt>
                  <dd className="mt-1 text-slate-600">{intern.profile?.skills || t.unset}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">{t.position}</dt>
                  <dd className="mt-1 text-slate-600">{intern.profile?.desired_position || t.unset}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
