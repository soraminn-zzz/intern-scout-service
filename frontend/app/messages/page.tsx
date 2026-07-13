"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, ScoutMessage, getMessages, getSavedAuth } from "@/lib/api";

const t = {
  dashboard: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",
  title: "\u30e1\u30c3\u30bb\u30fc\u30b8\u4e00\u89a7",
  lead: "\u9001\u53d7\u4fe1\u3057\u305f\u30b9\u30ab\u30a6\u30c8\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  empty: "\u30e1\u30c3\u30bb\u30fc\u30b8\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002",
  failed: "\u30e1\u30c3\u30bb\u30fc\u30b8\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  from: "\u9001\u4fe1\u8005",
  to: "\u53d7\u4fe1\u8005",
  unread: "\u672a\u8aad",
  read: "\u65e2\u8aad",
  detail: "\u8a73\u7d30",
};

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [messages, setMessages] = useState<ScoutMessage[]>([]);
  const [message, setMessage] = useState(t.loading);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      setUser(auth.user);
      getMessages(auth.token)
        .then((data) => {
          setMessages(data.messages);
          setMessage(data.messages.length === 0 ? t.empty : "");
        })
        .catch(() => setMessage(t.failed));
    });
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/dashboard">
            {t.dashboard}
          </Link>
        </header>

        <section>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.lead}</p>
        </section>

        {message && (
          <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {message}
          </p>
        )}

        <section className="grid gap-4">
          {messages.map((item) => {
            const isReceiver = user?.id === item.receiver.id;
            const status = item.read_at ? t.read : t.unread;

            return (
              <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {isReceiver ? `${t.from}: ${item.sender.name}` : `${t.to}: ${item.receiver.name}`}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(item.created_at).toLocaleString("ja-JP")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isReceiver && (
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${item.read_at ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>
                        {status}
                      </span>
                    )}
                    <Link className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white" href={`/messages/${item.id}`}>
                      {t.detail}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
