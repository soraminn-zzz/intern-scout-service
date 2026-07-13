"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JobPost, getJobPost, getSavedAuth } from "@/lib/api";

const t = {
  back: "\u52df\u96c6\u4e00\u89a7",
  title: "\u52df\u96c6\u8a73\u7d30",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  failed: "\u52df\u96c6\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  company: "\u4f01\u696d",
  description: "\u5185\u5bb9",
  skills: "\u5fc5\u8981\u30b9\u30ad\u30eb",
  location: "\u52e4\u52d9\u5730",
  postedAt: "\u63b2\u8f09\u65e5\u6642",
  unset: "\u672a\u8a2d\u5b9a",
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<JobPost | null>(null);
  const [message, setMessage] = useState(t.loading);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      getJobPost(auth.token, params.id)
        .then((data) => {
          setPost(data.job_post);
          setMessage("");
        })
        .catch(() => setMessage(t.failed));
    });
  }, [params.id, router]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header>
          <Link className="text-sm font-medium text-slate-600" href="/jobs">
            {t.back}
          </Link>
        </header>

        {message && <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}

        {post && (
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">{t.title}</p>
            <h1 className="mt-2 text-2xl font-semibold">{post.title}</h1>
            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-900">{t.company}</dt>
                <dd className="mt-1 text-slate-600">{post.company.name} / {post.company.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.description}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-slate-600">{post.description}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.skills}</dt>
                <dd className="mt-1 text-slate-600">{post.required_skills || t.unset}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.location}</dt>
                <dd className="mt-1 text-slate-600">{post.location || t.unset}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.postedAt}</dt>
                <dd className="mt-1 text-slate-600">{new Date(post.created_at).toLocaleString("ja-JP")}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
