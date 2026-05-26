import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, API_ORIGIN } from "../../api/client";
import AdminSidebar from "../../components/layout/AdminSidebar";

const toEmbedUrl = (value) => {
  if (!value) return "";
  if (value.includes("youtube.com/embed/")) return value;
  const yt = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  return value;
};

const imageUrl = (url) => (url?.startsWith("/uploads/") ? `${API_ORIGIN}${url}` : url);

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", thumbnail: "", video_url: "" });
  const [editingId, setEditingId] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const load = () => api.get("/courses").then((r) => setCourses(r.data));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setThumbnailFile(null);
    setForm({ title: "", description: "", thumbnail: "", video_url: "" });
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return;
    const body = new FormData();
    body.append("image", thumbnailFile);
    const { data } = await api.post("/courses/upload-thumbnail", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setForm((prev) => ({ ...prev, thumbnail: data.thumbnail }));

    // Jika sedang edit course, langsung sinkronkan thumbnail ke database.
    if (editingId) {
      const payload = {
        ...form,
        thumbnail: data.thumbnail,
        video_url: toEmbedUrl(form.video_url),
      };
      await api.put(`/courses/${editingId}`, payload);
      await load();
      toast.success("Thumbnail berhasil diupload & disimpan");
    } else {
      toast.success("Thumbnail berhasil diupload, klik Tambah Course untuk menyimpan");
    }
  };

  const removeThumbnail = async () => {
    if (form.thumbnail?.startsWith("/uploads/")) {
      await api.delete("/courses/thumbnail", { data: { thumbnail: form.thumbnail } });
    }
    setForm((prev) => ({ ...prev, thumbnail: "" }));
    setThumbnailFile(null);
    toast.success("Thumbnail dihapus");
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, video_url: toEmbedUrl(form.video_url) };
    if (editingId) {
      await api.put(`/courses/${editingId}`, payload);
      toast.success("Course diupdate");
    } else {
      await api.post("/courses", payload);
      toast.success("Course ditambahkan");
    }
    resetForm();
    load();
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      video_url: course.video_url || "",
    });
  };

  const del = async (id) => {
    const target = courses.find((c) => c.id === id);
    if (target?.thumbnail?.startsWith("/uploads/")) {
      await api.delete("/courses/thumbnail", { data: { thumbnail: target.thumbnail } });
    }
    await api.delete(`/courses/${id}`);
    toast.success("Course dihapus");
    load();
  };

  return (
    <main className="container-base flex flex-col gap-6 py-8 md:flex-row md:gap-8 md:py-10">
      <AdminSidebar />
      <section className="min-w-0 flex-1 md:mt-0">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900">Manage Courses</h1>
        <form onSubmit={save} className="mb-5 grid gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2">
          <input className="input-modern" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input-modern" placeholder="Video URL (YouTube link / embed URL)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />

          <div className="md:col-span-2 rounded-lg border border-zinc-200 p-3">
            <p className="mb-2 text-sm font-semibold text-zinc-700">Thumbnail Course</p>
            <div className="flex flex-wrap items-center gap-2">
              <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="text-sm" />
              <button type="button" onClick={uploadThumbnail} className="btn-secondary">Upload Thumbnail</button>
              {form.thumbnail ? <button type="button" onClick={removeThumbnail} className="btn-secondary">Hapus Thumbnail</button> : null}
            </div>
            {form.thumbnail ? <img src={imageUrl(form.thumbnail)} alt="thumbnail" className="mt-3 h-28 w-44 rounded object-cover" /> : null}
          </div>

          <textarea className="input-modern md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2 md:col-span-2">
            <button className="btn-primary">{editingId ? "Update Course" : "Tambah Course"}</button>
            {editingId && <button type="button" onClick={resetForm} className="btn-secondary">Batal</button>}
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-[520px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Thumbnail</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t border-zinc-100">
                  <td className="px-3 py-2 font-medium text-zinc-800">{c.title}</td>
                  <td className="px-3 py-2 text-zinc-600">
                    {c.thumbnail ? <img src={imageUrl(c.thumbnail)} alt={c.title} className="h-12 w-20 rounded object-cover" /> : "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => startEdit(c)} className="mr-2 rounded border border-zinc-300 px-2 py-1">Edit</button>
                    <button onClick={() => del(c.id)} className="rounded bg-red-500 px-2 py-1 text-white">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
