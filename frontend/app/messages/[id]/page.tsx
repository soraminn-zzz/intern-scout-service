"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScoutMessage, getMessage, getSavedAuth } from "@/lib/api";

const t = {
  back: "\u30e1\u30c3\u30bb\u30fc\u30b8\u4e00\u89a7",
  title: "\u30e1\u30c3\u30bb\u30fc\u30b8\u8a73\u7d30",
  loading: "\u8aad\u307f\u8fbc\u307f\u4e2d...",
  failed: "\u30e1\u30c3\u30bb\u30fc\u30b8\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  from: "\u9001\u4fe1\u8005",
  to: "\u53d7\u4fe1\u8005",
  sentAt: "\u9001\u4fe1\u65e5\u6642",
  readAt: "\u65e2\u8aad\u65e5\u6642",
  unread: "\u672a\u8aad",
};

export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ScoutMessage | null>(null);
  const [message, setMessage] = useState(t.loading);

  useEffect(() => {
    queueMicrotask(() => {
      const auth = getSavedAuth();

      if (!auth) {
        router.replace("/login");
        return;
      }

      getMessage(auth.token, params.id)
        .then((data) => {
          setItem(data.message);
          setMessage("");
        })
        .catch(() => setMessage(t.failed));
    });
  }, [params.id, router]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link className="text-sm font-medium text-slate-600" href="/messages">
            {t.back}
          </Link>
        </header>

        {message && (
          <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {message}
          </p>
        )}

        {item && (
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">{t.title}</p>
            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-900">{t.from}</dt>
                <dd className="mt-1 text-slate-600">{item.sender.name} / {item.sender.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.to}</dt>
                <dd className="mt-1 text-slate-600">{item.receiver.name} / {item.receiver.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.sentAt}</dt>
                <dd className="mt-1 text-slate-600">{new Date(item.created_at).toLocaleString("ja-JP")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{t.readAt}</dt>
                <dd className="mt-1 text-slate-600">{item.read_at ? new Date(item.read_at).toLocaleString("ja-JP") : t.unread}</dd>
              </div>
            </dl>
            <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
              {item.body}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
