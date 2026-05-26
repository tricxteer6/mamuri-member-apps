import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, API_ORIGIN } from "../../api/client";
import AdminSidebar from "../../components/layout/AdminSidebar";

const imageUrl = (url) => (url?.startsWith("/uploads/") ? `${API_ORIGIN}${url}` : url);

export default function AdminContentPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: "homepage", title: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [homeImageFile, setHomeImageFile] = useState(null);
  const [homeImageUrl, setHomeImageUrl] = useState("");
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [aboutImageUrl, setAboutImageUrl] = useState("");

  const load = () => api.get("/content").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const currentType = form.type;
    if (editingId) {
      await api.put(`/content/${editingId}`, form);
      toast.success("Konten diupdate");
    } else {
      await api.post("/content", form);
      toast.success("Konten tersimpan");
    }
    setForm({ type: currentType, title: "", body: "" });
    setEditingId(null);
    load();
  };

  const uploadImageByType = async (file, type, title, setPreview, resetFile) => {
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    const { data } = await api.post("/content/upload-image", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setPreview(data.image_url);
    await api.post("/content", { type, title, body: data.image_url });
    toast.success("Gambar berhasil diupload");
    resetFile(null);
    load();
  };

  const deleteImageItem = async (item) => {
    if (item.body?.startsWith("/uploads/")) {
      await api.delete("/content/image", { data: { image_url: item.body } });
    }
    await api.delete(`/content/${item.id}`);
    toast.success("Gambar dihapus");
    load();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ type: item.type, title: item.title, body: item.body });
  };

  const remove = async (id) => {
    await api.delete(`/content/${id}`);
    toast.success("Konten dihapus");
    load();
  };

  const homeImages = items.filter((it) => it.type === "homepage_image");
  const aboutImages = items.filter((it) => it.type === "about_image");
  const nonImageContent = items.filter(
    (it) => it.type !== "homepage_image" && it.type !== "about_image"
  );

  return (
    <main className="container-base flex flex-col gap-6 py-8 md:flex-row md:gap-8 md:py-10">
      <AdminSidebar />
      <section className="min-w-0 flex-1 space-y-6 md:mt-0">
        <div>
          <h1 className="mb-4 text-2xl font-bold text-zinc-900">Manage Content</h1>
          <form onSubmit={save} className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <select className="input-modern" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="homepage">Homepage</option>
              <option value="about">About</option>
              <option value="contact">Contact</option>
              <option value="about_image">About Image</option>
            </select>
            <input className="input-modern" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="input-modern" placeholder="Body" rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <div className="flex gap-2">
              <button className="btn-primary">{editingId ? "Update" : "Save"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm((prev) => ({ type: prev.type, title: "", body: "" })); }} className="btn-secondary">Batal</button>}
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">Homepage Image Manager</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input type="file" accept="image/*" onChange={(e) => setHomeImageFile(e.target.files?.[0] || null)} className="text-sm" />
            <button
              type="button"
              onClick={() =>
                uploadImageByType(
                  homeImageFile,
                  "homepage_image",
                  "Homepage Hero Image",
                  setHomeImageUrl,
                  setHomeImageFile
                )
              }
              className="btn-primary"
            >
              Upload Gambar Homepage
            </button>
          </div>
          {homeImageUrl ? <img src={imageUrl(homeImageUrl)} alt="preview" className="mt-3 h-36 w-full max-w-md rounded object-cover" /> : null}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {homeImages.map((img) => (
              <div key={img.id} className="rounded-lg border border-zinc-200 p-3">
                <img src={imageUrl(img.body)} alt={img.title} className="h-32 w-full rounded object-cover" />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-zinc-600">{img.title}</p>
                  <button onClick={() => deleteImageItem(img)} className="rounded bg-red-500 px-2 py-1 text-xs text-white">Delete</button>
                </div>
              </div>
            ))}
            {!homeImages.length && <p className="text-sm text-zinc-500">Belum ada gambar homepage.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">About Image Manager</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input type="file" accept="image/*" onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)} className="text-sm" />
            <button
              type="button"
              onClick={() =>
                uploadImageByType(
                  aboutImageFile,
                  "about_image",
                  "About Hero Image",
                  setAboutImageUrl,
                  setAboutImageFile
                )
              }
              className="btn-primary"
            >
              Upload Gambar About
            </button>
          </div>
          {aboutImageUrl ? <img src={imageUrl(aboutImageUrl)} alt="about preview" className="mt-3 h-36 w-full max-w-md rounded object-cover" /> : null}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {aboutImages.map((img) => (
              <div key={img.id} className="rounded-lg border border-zinc-200 p-3">
                <img src={imageUrl(img.body)} alt={img.title} className="h-32 w-full rounded object-cover" />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-zinc-600">{img.title}</p>
                  <button onClick={() => deleteImageItem(img)} className="rounded bg-red-500 px-2 py-1 text-xs text-white">Delete</button>
                </div>
              </div>
            ))}
            {!aboutImages.length && <p className="text-sm text-zinc-500">Belum ada gambar about.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {nonImageContent.map((it) => (
                <tr key={it.id} className="border-t border-zinc-100">
                  <td className="px-3 py-2"><span className="rounded bg-zinc-100 px-2 py-1 text-xs">{it.type}</span></td>
                  <td className="px-3 py-2 text-zinc-700">{it.title}</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => startEdit(it)} className="mr-2 rounded border border-zinc-300 px-2 py-1">Edit</button>
                    <button onClick={() => remove(it.id)} className="rounded bg-red-500 px-2 py-1 text-white">Hapus</button>
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
