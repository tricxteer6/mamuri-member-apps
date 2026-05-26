import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_ORIGIN } from "../api/client";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useAuth } from "../hooks/useAuth";

const DEFAULT_THUMBNAIL = "/logo.png";

function plainDescription(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const imageUrl = (url) => {
    if (!url) return DEFAULT_THUMBNAIL;
    if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return DEFAULT_THUMBNAIL;
  };

  return (
    <main className="container-base py-8 sm:py-10 md:py-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="heading-gradient text-3xl font-black tracking-tight sm:text-4xl">Katalog Course</h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          Lihat materi yang tersedia. Login sebagai member untuk mulai belajar.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        {!loading &&
          courses.map((c) => {
            const blurb = plainDescription(c.description);
            return (
              <article
                key={c.id}
                className="surface-card flex flex-col overflow-hidden border-zinc-200/90 p-0 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
                  <img
                    src={imageUrl(c.thumbnail)}
                    alt={c.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_THUMBNAIL;
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-snug text-zinc-900">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600">
                    {blurb || "—"}
                  </p>
                  <Link
                    to={!isAuthenticated ? "/login" : `/courses/${c.id}`}
                    className="btn-primary mt-5 w-full justify-center py-3"
                  >
                    {!isAuthenticated ? "Login untuk akses" : "Mulai belajar"}
                  </Link>
                </div>
              </article>
            );
          })}
      </div>
    </main>
  );
}
