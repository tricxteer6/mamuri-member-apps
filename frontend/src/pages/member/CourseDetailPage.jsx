import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import { api, API_ORIGIN } from "../../api/client";

const toEmbedUrl = (value) => {
  if (!value) return "";
  if (value.includes("youtube.com/embed/")) return value;
  const yt = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  return value;
};

const DEFAULT_THUMBNAIL =
  "/logo.png";

const imageUrl = (url) => {
  if (!url) return DEFAULT_THUMBNAIL;
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return DEFAULT_THUMBNAIL;
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const loadComments = useCallback(() => {
    api.get(`/courses/${id}/comments`).then((res) => setComments(res.data));
  }, [id]);

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
    api
      .get("/courses")
      .then((res) => setCourses(res.data.filter((item) => String(item.id) !== String(id))));
    loadComments();
  }, [id, loadComments]);

  if (!course) return <Loader />;

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await api.post(`/courses/${id}/comments`, { comment: commentInput.trim() });
    setCommentInput("");
    loadComments();
  };

  return (
    <main className="container-base py-6 sm:py-8 md:py-10">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
        <section className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:rounded-3xl">
          <div className="aspect-video min-h-[12rem] bg-black sm:min-h-0">
            <iframe
              src={toEmbedUrl(course.video_url)}
              title={course.title}
              className="h-full w-full min-h-[12rem] sm:min-h-0"
              allowFullScreen
            />
          </div>
          <div className="p-4 text-left sm:p-5 md:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">Kelas Online</span>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Mentoring Mamuri</span>
            </div>
            <h1 className="text-xl font-extrabold leading-tight text-zinc-900 sm:text-2xl md:text-3xl">{course.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-zinc-600">{course.description}</p>
          </div>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5 sm:rounded-3xl">
            <h2 className="text-lg font-bold text-zinc-900">Komentar</h2>
            <form onSubmit={submitComment} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Tulis komentar..."
                className="min-h-11 w-full flex-1 rounded-xl border border-zinc-300 px-3 py-2.5 text-base outline-none focus:border-red-400 sm:text-sm"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
              >
                Kirim
              </button>
            </form>
            <div className="mt-4 space-y-3">
              {comments.map((item) => (
                <div key={item.id} className="rounded-lg border border-zinc-200 p-3">
                  <p className="text-sm font-semibold text-zinc-800">{item.name}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.comment}</p>
                </div>
              ))}
              {!comments.length && <p className="text-sm text-zinc-500">Belum ada komentar.</p>}
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-zinc-900">Rekomendasi Course</h2>
            <div className="mt-3 space-y-2 text-sm text-zinc-600">
              {courses.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  to={`/courses/${item.id}`}
                  className="flex gap-2 rounded-lg border border-zinc-200 px-2 py-2 transition hover:bg-zinc-50"
                >
                  <img
                    src={imageUrl(item.thumbnail)}
                    alt={item.title}
                    className="h-12 w-20 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_THUMBNAIL;
                    }}
                  />
                  <p className="line-clamp-2 text-xs font-semibold text-zinc-700">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

