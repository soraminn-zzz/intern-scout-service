"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  InternProfile,
  getInternProfile,
  getSavedAuth,
  updateInternProfile,
} from "@/lib/api";

const emptyProfile: InternProfile = {
  school_name: "",
  graduation_year: null,
  bio: "",
  skills: "",
  desired_position: "",
};

const t = {
  back: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  title: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u7de8\u96c6",
  lead: "\u4f01\u696d\u304c\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7\u3067\u78ba\u8a8d\u3059\u308b\u60c5\u5831\u3067\u3059\u3002",
  school: "\u5b66\u6821\u540d",
  graduationYear: "\u5352\u696d\u5e74",
  bio: "\u81ea\u5df1\u7d39\u4ecb",
  skills: "\u30b9\u30ad\u30eb",
  desiredPosition: "\u5e0c\u671b\u8077\u7a2e",
  saving: "\u4fdd\u5b58\u4e2d...",
  save: "\u4fdd\u5b58\u3059\u308b",
  saved: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002",
  failed: "\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  internOnly: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u7de8\u96c6\u306f\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u306e\u307f\u5229\u7528\u3067\u304d\u307e\u3059\u3002",
};

export default function ProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<InternProfile>(emptyProfile);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      if (auth.user.role !== "intern") {
        setIsForbidden(true);
        return;
      }

      setToken(auth.token);
      getInternProfile(auth.token)
        .then((data) => {
          if (data.intern_profile) {
            setProfile({
              ...emptyProfile,
              ...data.intern_profile,
            });
          }
        })
        .catch(() => setMessage(t.failed));
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const data = await updateInternProfile(token, profile);
      setProfile({
        ...emptyProfile,
        ...data.intern_profile,
      });
      setMessage(t.saved);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.failed);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isForbidden) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
        <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">{t.internOnly}</p>
          <Link className="mt-4 inline-block text-sm font-semibold text-emerald-700" href="/dashboard">
            {t.back}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/dashboard">
            {t.back}
          </Link>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.school}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setProfile({ ...profile, school_name: event.target.value })} required value={profile.school_name} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.graduationYear}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setProfile({ ...profile, graduation_year: event.target.value ? Number(event.target.value) : null })} type="number" value={profile.graduation_year ?? ""} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.bio}
              <textarea className="min-h-28 rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setProfile({ ...profile, bio: event.target.value })} value={profile.bio} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.skills}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setProfile({ ...profile, skills: event.target.value })} placeholder="Ruby, Rails, TypeScript" value={profile.skills} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.desiredPosition}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setProfile({ ...profile, desired_position: event.target.value })} value={profile.desired_position} />
            </label>

            <button className="mt-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting || !token} type="submit">
              {isSubmitting ? t.saving : t.save}
            </button>
          </form>

          {message && <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
        </section>
      </div>
    </main>
  );
}
