import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user, updateSession } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setForm({ name: res.data.name || "", email: res.data.email || "" });
      })
      .catch(() => {
        setForm({ name: user?.name || "", email: user?.email || "" });
        toast.error("Gagal memuat data profil");
      })
      .finally(() => setLoading(false));
  }, [user?.name, user?.email]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.patch("/auth/me", form);
      updateSession(data);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      const message = error?.response?.data?.message || "Gagal menyimpan profil";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const backTo = user?.role === "admin" ? "/admin" : "/member";

  return (
    <main className="container-base py-10 sm:py-14 md:py-16">
      <div className="surface-card mx-auto max-w-md space-y-4 p-5 sm:p-7">
        <h1 className="text-3xl font-bold text-red-500">Ubah profil</h1>
        <p className="text-sm text-zinc-600">Perbarui nama dan email akunmu.</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="input-modern"
            placeholder="Nama"
            value={form.name}
            disabled={loading}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input-modern"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            disabled={loading}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button className="btn-primary w-full" type="submit" disabled={loading || submitting}>
            {submitting ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </form>
        <div className="border-t border-zinc-200 pt-4">
          <p className="mb-2 text-sm font-medium text-zinc-700">Keamanan</p>
          <Link
            to="/account/password"
            className="text-sm text-red-600 underline hover:text-red-700"
          >
            Ganti password
          </Link>
        </div>
        <Link
          to={backTo}
          className="block text-center text-sm text-zinc-600 underline hover:text-zinc-900"
        >
          Kembali ke dashboard
        </Link>
      </div>
    </main>
  );
}
