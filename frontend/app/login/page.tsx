"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { loginUser, saveAuth } from "@/lib/api";

const t = {
  register: "\u767b\u9332",
  title: "\u30ed\u30b0\u30a4\u30f3",
  lead: "\u767b\u9332\u6e08\u307f\u306e\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3068\u30d1\u30b9\u30ef\u30fc\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  email: "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9",
  password: "\u30d1\u30b9\u30ef\u30fc\u30c9",
  submitting: "\u30ed\u30b0\u30a4\u30f3\u4e2d...",
  submit: "\u30ed\u30b0\u30a4\u30f3\u3059\u308b",
  failed: "\u30ed\u30b0\u30a4\u30f3\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const auth = await loginUser({ email, password });
      saveAuth(auth);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.failed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/">
            Scout
          </Link>
          <Link className="text-sm font-semibold text-emerald-700" href="/register">
            {t.register}
          </Link>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.email}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.password}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </label>

            <button className="mt-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting} type="submit">
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </form>

          {message && <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
        </section>
      </div>
    </main>
  );
}
