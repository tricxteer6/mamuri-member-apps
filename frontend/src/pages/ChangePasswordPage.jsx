import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password berhasil diubah");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Gagal mengubah password. Coba lagi.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const backTo = user?.role === "admin" ? "/admin" : "/member";

  return (
    <main className="container-base py-10 sm:py-14 md:py-16">
      <form onSubmit={submit} className="surface-card mx-auto max-w-md space-y-4 p-5 sm:p-7">
        <h1 className="text-2xl font-bold text-red-500 sm:text-3xl">Ganti password</h1>
        <p className="text-sm text-zinc-600">
          Masukkan password lama lalu password baru (minimal 6 karakter).
        </p>
        <input
          className="input-modern"
          type="password"
          autoComplete="current-password"
          placeholder="Password lama"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
        <input
          className="input-modern"
          type="password"
          autoComplete="new-password"
          placeholder="Password baru"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <input
          className="input-modern"
          type="password"
          autoComplete="new-password"
          placeholder="Konfirmasi password baru"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <button className="btn-primary w-full py-3" type="submit" disabled={submitting}>
          {submitting ? "Menyimpan…" : "Simpan password baru"}
        </button>
        <Link to={backTo} className="block text-center text-sm text-zinc-600 underline hover:text-zinc-900">
          Kembali ke dashboard
        </Link>
      </form>
    </main>
  );
}
