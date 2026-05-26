import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const WA_DEFAULT_TEXT =
  "Halo admin Mamuri, saya ingin bertanya tentang pembuatan akun member.";

function buildWhatsAppUrl() {
  const raw = import.meta.env.VITE_CONTACT_WHATSAPP || "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(
    import.meta.env.VITE_WHATSAPP_PRESET_TEXT || WA_DEFAULT_TEXT
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      toast.success("Login berhasil");
      navigate(data.user.role === "admin" ? "/admin" : "/member");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Login gagal. Cek email/password atau konfigurasi API HTTPS.";
      toast.error(message);
    }
  };

  const waUrl = buildWhatsAppUrl();

  return (
    <main className="container-base flex min-h-[calc(100dvh-5rem)] flex-col justify-center py-10 sm:py-14 md:py-16">
      <form onSubmit={submit} className="surface-card mx-auto w-full max-w-md space-y-4 p-5 sm:p-7">
        <h1 className="text-2xl font-bold text-red-500 sm:text-3xl">Login</h1>
        <input
          className="input-modern"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input-modern"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="btn-primary w-full py-3">
          Masuk
        </button>
        <p className="text-center text-sm leading-relaxed text-zinc-600 sm:text-left">
          Belum punya akun? Silakan{" "}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-600 underline decoration-red-300 underline-offset-2 transition hover:text-red-700"
            >
              hubungi admin via WhatsApp
            </a>
          ) : (
            <Link
              to={{ pathname: "/", hash: "contact" }}
              className="font-semibold text-red-600 underline decoration-red-300 underline-offset-2 transition hover:text-red-700"
            >
              hubungi admin
            </Link>
          )}
          {waUrl ? "." : " (form kontak)."}
        </p>
      </form>
    </main>
  );
}

