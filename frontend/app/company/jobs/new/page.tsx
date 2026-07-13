"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createJobPost, getSavedAuth } from "@/lib/api";

const t = {
  back: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  title: "\u52df\u96c6\u63b2\u8f09",
  lead: "\u4f01\u696d\u304c\u30a4\u30f3\u30bf\u30fc\u30f3\u52df\u96c6\u3092\u63b2\u8f09\u3067\u304d\u307e\u3059\u3002",
  titleLabel: "\u30bf\u30a4\u30c8\u30eb",
  description: "\u5185\u5bb9",
  skills: "\u5fc5\u8981\u30b9\u30ad\u30eb",
  location: "\u52e4\u52d9\u5730",
  submitting: "\u63b2\u8f09\u4e2d...",
  submit: "\u63b2\u8f09\u3059\u308b",
  failed: "\u52df\u96c6\u306e\u63b2\u8f09\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  forbidden: "\u4f01\u696d\u30e6\u30fc\u30b6\u30fc\u306e\u307f\u5229\u7528\u3067\u304d\u307e\u3059\u3002",
};

export default function NewJobPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      if (auth.user.role !== "company") {
        setMessage(t.forbidden);
        return;
      }

      setToken(auth.token);
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const data = await createJobPost(token, {
        title,
        description,
        requiredSkills,
        location,
      });
      router.push(`/jobs/${data.job_post.id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.failed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header>
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
              {t.titleLabel}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setTitle(event.target.value)} required value={title} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.description}
              <textarea className="min-h-32 rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setDescription(event.target.value)} required value={description} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.skills}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setRequiredSkills(event.target.value)} placeholder="Ruby, Rails, TypeScript" value={requiredSkills} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.location}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setLocation(event.target.value)} value={location} />
            </label>
            <button className="mt-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting || !token} type="submit">
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </form>

          {message && <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
        </section>
      </div>
    </main>
  );
}
