"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, clearAuth, getSavedAuth } from "@/lib/api";

const t = {
  title: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  logout: "\u30ed\u30b0\u30a2\u30a6\u30c8",
  loggedInAs: "\u30ed\u30b0\u30a4\u30f3\u4e2d",
  internGuide: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u767b\u9332\u3059\u308b\u3068\u3001\u4f01\u696d\u304c\u4e00\u89a7\u3067\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002",
  companyGuide: "\u6b21\u306f\u4f01\u696d\u5411\u3051\u306e\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7\u753b\u9762\u3092\u5b9f\u88c5\u3057\u307e\u3059\u3002",
  browseInterns: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u3092\u63a2\u3059",
  messages: "\u30e1\u30c3\u30bb\u30fc\u30b8",
  jobs: "\u52df\u96c6\u3092\u898b\u308b",
  newJob: "\u52df\u96c6\u3092\u63b2\u8f09\u3059\u308b",
  favorites: "\u304a\u6c17\u306b\u5165\u308a",
  savedJobs: "\u4fdd\u5b58\u3057\u305f\u52df\u96c6",
  editProfile: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u7de8\u96c6",
  comingSoon: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7\u306f\u6b21\u306b\u5b9f\u88c5\u4e88\u5b9a\u3067\u3059",
  roleIntern: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f",
  roleCompany: "\u4f01\u696d",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      setUser(auth.user);
    });
  }, [router]);

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
        <p className="text-sm text-slate-600">{t.loading}</p>
      </main>
    );
  }

  const roleLabel = user.role === "intern" ? t.roleIntern : t.roleCompany;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/">
            Scout
          </Link>
          <button className="text-sm font-semibold text-slate-600" onClick={handleLogout} type="button">
            {t.logout}
          </button>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">{t.loggedInAs}</p>
          <h1 className="mt-2 text-2xl font-semibold">{t.title}</h1>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-900">ID</dt>
              <dd className="mt-1 text-slate-600">{user.id}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Name</dt>
              <dd className="mt-1 text-slate-600">{user.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Role</dt>
              <dd className="mt-1 text-slate-600">{roleLabel}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {user.role === "intern" ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-6 text-slate-600">{t.internGuide}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="w-fit rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" href="/profile">
                  {t.editProfile}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/messages">
                  {t.messages}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/jobs">
                  {t.jobs}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/saved-jobs">
                  {t.savedJobs}
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-6 text-slate-600">{t.companyGuide}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="w-fit rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" href="/interns">
                  {t.browseInterns}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/favorite-interns">
                  {t.favorites}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/messages">
                  {t.messages}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/jobs">
                  {t.jobs}
                </Link>
                <Link className="w-fit rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/company/jobs/new">
                  {t.newJob}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
