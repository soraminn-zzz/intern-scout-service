"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AuthUser,
  JobPost,
  getJobPosts,
  getSavedAuth,
  saveJobPost,
  unsaveJobPost,
} from "@/lib/api";

const t = {
  dashboard: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  title: "\u52df\u96c6\u4e00\u89a7",
  lead: "\u52e4\u52d9\u5730\u3001\u5fc5\u8981\u30b9\u30ad\u30eb\u3001\u30ad\u30fc\u30ef\u30fc\u30c9\u3067\u52df\u96c6\u3092\u63a2\u305b\u307e\u3059\u3002",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  empty: "\u6761\u4ef6\u306b\u5408\u3046\u52df\u96c6\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
  failed: "\u52df\u96c6\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  company: "\u4f01\u696d",
  skills: "\u5fc5\u8981\u30b9\u30ad\u30eb",
  location: "\u52e4\u52d9\u5730",
  detail: "\u8a73\u7d30",
  unset: "\u672a\u8a2d\u5b9a",
  newJob: "\u52df\u96c6\u3092\u63b2\u8f09",
  search: "\u691c\u7d22",
  reset: "\u30ea\u30bb\u30c3\u30c8",
  keyword: "\u30ad\u30fc\u30ef\u30fc\u30c9",
  keywordPlaceholder: "\u4f8b: Rails, API, UI",
  locationPlaceholder: "\u4f8b: Tokyo, Remote",
  skillPlaceholder: "\u4f8b: Ruby, TypeScript",
  save: "\u4fdd\u5b58",
  saved: "\u4fdd\u5b58\u6e08\u307f",
};

export default function JobsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [message, setMessage] = useState(t.loading);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");

  const loadJobs = useCallback(function loadJobs(
    authToken: string,
    filters: { keyword?: string; location?: string; skill?: string },
  ) {
    setMessage(t.loading);
    getJobPosts(authToken, filters)
      .then((data) => {
        setPosts(data.job_posts);
        setMessage(data.job_posts.length === 0 ? t.empty : "");
      })
      .catch(() => setMessage(t.failed));
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      setToken(auth.token);
      setUser(auth.user);
      loadJobs(auth.token, { keyword: "", location: "", skill: "" });
    });
  }, [loadJobs, router]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadJobs(token, { keyword, location, skill });
  }

  function handleReset() {
    setKeyword("");
    setLocation("");
    setSkill("");
    loadJobs(token, { keyword: "", location: "", skill: "" });
  }

  async function handleToggleSave(post: JobPost) {
    if (!token || user?.role !== "intern") return;

    if (post.is_saved) {
      await unsaveJobPost(token, post.id);
    } else {
      await saveJobPost(token, post.id);
    }

    setPosts((current) =>
      current.map((item) =>
        item.id === post.id ? { ...item, is_saved: !item.is_saved } : item,
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
          {user?.role === "company" && (
            <Link className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white" href="/company/jobs/new">
              {t.newJob}
            </Link>
          )}
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>

          <form className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]" onSubmit={handleSearch}>
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600" onChange={(event) => setKeyword(event.target.value)} placeholder={t.keywordPlaceholder} value={keyword} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600" onChange={(event) => setLocation(event.target.value)} placeholder={t.locationPlaceholder} value={location} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600" onChange={(event) => setSkill(event.target.value)} placeholder={t.skillPlaceholder} value={skill} />
            <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white" type="submit">
              {t.search}
            </button>
            <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={handleReset} type="button">
              {t.reset}
            </button>
          </form>
        </section>

        {message && <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}

        <section className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t.company}: {post.company.name}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {user?.role === "intern" && (
                    <button className={`rounded-md px-3 py-2 text-sm font-semibold ${post.is_saved ? "bg-emerald-50 text-emerald-700" : "border border-slate-300 text-slate-700"}`} onClick={() => handleToggleSave(post)} type="button">
                      {post.is_saved ? t.saved : t.save}
                    </button>
                  )}
                  <Link className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white" href={`/jobs/${post.id}`}>
                    {t.detail}
                  </Link>
                </div>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-900">{t.skills}</dt>
                  <dd className="mt-1 text-slate-600">{post.required_skills || t.unset}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">{t.location}</dt>
                  <dd className="mt-1 text-slate-600">{post.location || t.unset}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
