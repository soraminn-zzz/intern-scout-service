"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Intern, createMessage, getIntern, getSavedAuth } from "@/lib/api";

const t = {
  back: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u4e00\u89a7",
  title: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u8a73\u7d30",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  forbidden: "\u4f01\u696d\u30e6\u30fc\u30b6\u30fc\u306e\u307f\u5229\u7528\u3067\u304d\u307e\u3059\u3002",
  failed: "\u8a73\u7d30\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  school: "\u5b66\u6821",
  graduationYear: "\u5352\u696d\u5e74",
  bio: "\u81ea\u5df1\u7d39\u4ecb",
  skills: "\u30b9\u30ad\u30eb",
  position: "\u5e0c\u671b\u8077\u7a2e",
  unset: "\u672a\u8a2d\u5b9a",
  messageTitle: "\u30b9\u30ab\u30a6\u30c8\u30e1\u30c3\u30bb\u30fc\u30b8",
  messagePlaceholder: "\u30a4\u30f3\u30bf\u30fc\u30f3\u306e\u6848\u5185\u6587\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  sending: "\u9001\u4fe1\u4e2d...",
  send: "\u9001\u4fe1\u3059\u308b",
  sent: "\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u9001\u4fe1\u3057\u307e\u3057\u305f\u3002",
  sendFailed: "\u30e1\u30c3\u30bb\u30fc\u30b8\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
};

export default function InternDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [intern, setIntern] = useState<Intern | null>(null);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState(t.loading);
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
      getIntern(auth.token, params.id)
        .then((data) => {
          setIntern(data.intern);
          setMessage("");
        })
        .catch(() => setMessage(t.failed));
    });
  }, [params.id, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!intern) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createMessage(token, { receiverId: intern.id, body });
      setBody("");
      setMessage(t.sent);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.sendFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/interns">
            {t.back}
          </Link>
        </header>

        {message && (
          <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {message}
          </p>
        )}

        {intern && (
          <>
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-emerald-700">{t.title}</p>
              <h1 className="mt-2 text-2xl font-semibold">{intern.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{intern.email}</p>
              <dl className="mt-6 grid gap-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-900">{t.school}</dt>
                  <dd className="mt-1 text-slate-600">{intern.profile?.school_name || t.unset}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">{t.graduationYear}</dt>
                  <dd className="mt-1 text-slate-600">{intern.profile?.graduation_year || t.unset}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">{t.bio}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-slate-600">{intern.profile?.bio || t.unset}</dd>
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
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{t.messageTitle}</h2>
              <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
                <textarea className="min-h-36 rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setBody(event.target.value)} placeholder={t.messagePlaceholder} required value={body} />
                <button className="rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting || !token} type="submit">
                  {isSubmitting ? t.sending : t.send}
                </button>
              </form>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
