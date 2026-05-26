import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_ORIGIN } from "../../api/client";
import SkeletonCard from "../../components/ui/SkeletonCard";

const DEFAULT_THUMBNAIL = "/logo.png";

function plainDescription(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function MemberDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data)).finally(() => setLoading(false));
  }, []);

  const imageUrl = (url) => {
    if (!url) return DEFAULT_THUMBNAIL;
    if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return DEFAULT_THUMBNAIL;
  };

  return (
    <main className="container-base py-8 md:py-12">
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-red-100/70 bg-linear-to-br from-white via-white to-red-50/40 p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] md:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-red-400/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <p className="mb-4 inline-flex items-center rounded-full border border-red-100 bg-red-50/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-red-700">
            Area member
          </p>
          <h1 className="heading-gradient text-3xl font-black tracking-tight md:text-4xl">
            Dashboard Member
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 md:text-lg">
            Lanjutkan course favoritmu dan capai progres belajar mingguan.
          </p>
        </div>
      </section>

      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Course tersedia</h2>
          <p className="mt-1 text-sm text-zinc-500">Pilih materi di bawah untuk mulai menonton</p>
        </div>
        {!loading && courses.length > 0 && (
          <p className="text-sm font-medium text-zinc-400">{courses.length} course</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        {!loading &&
          courses.map((c) => {
            const blurb = plainDescription(c.description);
            return (
              <Link
                key={c.id}
                to={`/courses/${c.id}`}
                className="group surface-card flex flex-col overflow-hidden border-zinc-200/90 p-0 shadow-md transition duration-300 hover:-translate-y-1 hover:border-red-200/80 hover:shadow-xl hover:shadow-red-500/[0.07]"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
                  <img
                    src={imageUrl(c.thumbnail)}
                    alt={c.title}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_THUMBNAIL;
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-zinc-900/35 via-transparent to-transparent opacity-60 transition group-hover:opacity-80"
                    aria-hidden
                  />
                  <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm backdrop-blur-sm">
                    Course
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-snug text-zinc-900 line-clamp-2">{c.title}</h3>
                  {blurb ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">{blurb}</p>
                  ) : (
                    <p className="mt-2 text-sm italic text-zinc-400">Tanpa deskripsi</p>
                  )}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                    <span className="text-sm font-semibold text-red-600 transition group-hover:text-red-700">
                      Mulai belajar
                    </span>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition group-hover:bg-red-600"
                      aria-hidden
                    >
                      <svg className="h-4 w-4 translate-x-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      {!loading && courses.length === 0 && (
        <div className="surface-card rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-zinc-800">Belum ada course</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            Course akan muncul di sini setelah admin menambahkan materi. Cek lagi nanti.
          </p>
        </div>
      )}
    </main>
  );
}
