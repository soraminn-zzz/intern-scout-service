"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser, saveAuth, UserRole } from "@/lib/api";

const t = {
  login: "\u30ed\u30b0\u30a4\u30f3",
  title: "\u30a2\u30ab\u30a6\u30f3\u30c8\u767b\u9332",
  lead: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f\u307e\u305f\u306f\u4f01\u696d\u3068\u3057\u3066\u767b\u9332\u3067\u304d\u307e\u3059\u3002",
  intern: "\u30a4\u30f3\u30bf\u30fc\u30f3\u751f",
  company: "\u4f01\u696d",
  name: "\u540d\u524d",
  email: "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9",
  password: "\u30d1\u30b9\u30ef\u30fc\u30c9",
  confirmPassword: "\u30d1\u30b9\u30ef\u30fc\u30c9\u78ba\u8a8d",
  submitting: "\u767b\u9332\u4e2d...",
  submit: "\u767b\u9332\u3059\u308b",
  failed: "\u767b\u9332\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
};

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("intern");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const auth = await registerUser({
        name,
        email,
        password,
        passwordConfirmation,
        role,
      });
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
          <Link className="text-sm font-semibold text-emerald-700" href="/login">
            {t.login}
          </Link>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1">
              <button
                className={`rounded px-3 py-2 text-sm font-medium ${role === "intern" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`}
                onClick={() => setRole("intern")}
                type="button"
              >
                {t.intern}
              </button>
              <button
                className={`rounded px-3 py-2 text-sm font-medium ${role === "company" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`}
                onClick={() => setRole("company")}
                type="button"
              >
                {t.company}
              </button>
            </div>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.name}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setName(event.target.value)} required value={name} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.email}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.password}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              {t.confirmPassword}
              <input className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-emerald-600" minLength={8} onChange={(event) => setPasswordConfirmation(event.target.value)} required type="password" value={passwordConfirmation} />
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
