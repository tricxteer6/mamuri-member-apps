import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api, API_ORIGIN } from "../api/client";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

const features = [
  {
    title: "Produk Siap Pakai",
    desc: "Bumbu masak praktis Mamuri untuk masak cepat, rasa tetap nikmat.",
    accent: "from-red-500/10 to-rose-100/40",
  },
  {
    title: "Resep Praktis",
    desc: "Panduan olahan menu harian dengan bumbu Mamuri yang mudah diikuti.",
    accent: "from-amber-500/10 to-amber-100/50",
  },
  {
    title: "Distribusi Luas",
    desc: "Dukung kebutuhan konsumen, reseller, dan mitra penjualan di berbagai area.",
    accent: "from-stone-500/10 to-stone-100/60",
  },
];

const defaultAboutCards = [
  {
    title: "Visi",
    body: "Menjadi brand bumbu masak praktis pilihan utama keluarga Indonesia.",
  },
  {
    title: "Misi",
    body: "Menyediakan produk bumbu yang praktis, lezat, dan konsisten kualitasnya.",
  },
  {
    title: "Nilai",
    body: "Rasa, kualitas bahan, dan kemudahan memasak untuk semua kalangan.",
  },
];

function scrollToHash(hash) {
  const id = hash?.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function HomePage() {
  const location = useLocation();
  const [aboutItems, setAboutItems] = useState([]);
  const [aboutImage, setAboutImage] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    api.get("/content?type=about").then((res) => {
      setAboutItems(res.data || []);
    });
    api.get("/content?type=about_image").then((res) => {
      const first = res.data?.[0];
      if (first?.body) {
        setAboutImage(
          first.body.startsWith("/uploads/")
            ? `${API_ORIGIN}${first.body}`
            : first.body,
        );
      }
    });
  }, []);

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => scrollToHash(hash), 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  const aboutCards = [...aboutItems.slice(0, 3)];
  for (let i = aboutCards.length; i < 3; i += 1) {
    aboutCards.push(defaultAboutCards[i]);
  }

  const submitContact = async (e) => {
    e.preventDefault();
    await api.post("/content/contact", contactForm);
    toast.success("Pesan terkirim");
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="overflow-x-hidden">
      <section
        id="home"
        className="scroll-mt-20 relative border-b border-red-100/40 bg-linear-to-br from-white via-red-50/25 to-amber-50/20 md:scroll-mt-24"
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-red-400/15 blur-3xl sm:-left-16"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.5, 0.35] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl sm:right-0"
            animate={{ scale: [1.08, 1, 1.08], opacity: [0.3, 0.45, 0.3] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute left-1/2 top-1/4 hidden h-px w-[min(80vw,42rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-red-200/60 to-transparent md:block" />
        </div>

        <div className="container-base relative py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                initial: {},
                animate: { transition: { staggerChildren: 0.09 } },
              }}
              className="text-center lg:text-left"
            >
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="mb-4 inline-flex rounded-full border border-red-200/80 bg-red-50/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red-700 shadow-sm"
              >
                Member Area Mamuri
              </motion.p>
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="heading-gradient text-balance text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Mamuri, Solusi Bumbu Masak Praktis Siap Pakai
              </motion.h1>
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg lg:mx-0"
              >
                Mamuri berfokus pada pengembangan dan penjualan produk bumbu
                masak praktis untuk kebutuhan rumah tangga hingga usaha kuliner.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                delay: 0.12,
              }}
              className="relative mx-auto flex w-full max-w-[min(100%,20rem)] justify-center sm:max-w-xs lg:max-w-md"
            >
              <motion.div
                className="absolute inset-0 rounded-4xl bg-linear-to-br from-red-200/30 to-amber-200/25 blur-xl"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative aspect-square w-full rounded-4xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(185,28,28,0.2)] backdrop-blur-md sm:p-10">
                <motion.img
                  src="/logo.png"
                  alt="Mamuri"
                  className="h-full w-full object-contain drop-shadow-xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-3 rounded-3xl border border-dashed border-red-200/50"
                  aria-hidden
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container-base py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:mb-12"
        >
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            Kenapa Mamuri?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600 sm:text-base">
            Tiga pilar yang membuat memasak dengan Mamuri lebih praktis dan
            konsisten.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: idx * 0.07, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="surface-card relative overflow-hidden border-zinc-200/90 p-6 shadow-md transition-shadow hover:shadow-lg sm:p-7"
            >
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-linear-to-br ${item.accent} blur-2xl`}
                aria-hidden
              />
              <span className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-lg font-black text-white shadow-sm">
                {idx + 1}
              </span>
              <h3 className="relative z-10 text-lg font-bold text-zinc-900">
                {item.title}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                {item.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-20 border-t border-red-100/40 bg-white/40 py-10 sm:scroll-mt-24 sm:py-14 md:py-16"
      >
        <div className="container-base">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="surface-card p-6 sm:p-8">
              <h2 className="heading-gradient mb-4 text-3xl font-black tracking-tight sm:text-4xl">
                About Mamuri
              </h2>
              <p className="text-base leading-relaxed text-zinc-600">
                Mamuri adalah brand yang bergerak di bidang penjualan produk
                bumbu masak praktis berkualitas.
              </p>
              {aboutImage ? (
                <img
                  src={aboutImage}
                  alt="About Mamuri"
                  className="mt-6 max-h-[min(70vh,22rem)] w-full rounded-2xl object-cover sm:max-h-none sm:h-72 md:h-80"
                />
              ) : (
                <div className="mt-6 grid min-h-[12rem] place-items-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center text-zinc-500 sm:min-h-[16rem] md:h-80">
                  <p className="max-w-md text-sm leading-relaxed">
                    Belum ada gambar About. Upload gambar di Admin &gt; Manage
                    Content &gt; About Image Manager.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
              {aboutCards.map((item, idx) => (
                <article
                  key={`${item.title}-${idx}`}
                  className="surface-card p-5 sm:p-6"
                >
                  <h3 className="text-lg font-bold text-zinc-900 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-20 border-t border-red-100/40 py-10 sm:scroll-mt-24 sm:py-14 md:py-16"
      >
        <div className="container-base">
          <form
            onSubmit={submitContact}
            className="surface-card mx-auto max-w-xl space-y-4 p-5 sm:p-7"
          >
            <h2 className="text-2xl font-bold text-red-500 sm:text-3xl">
              Contact Us
            </h2>
            <p className="text-sm text-zinc-600">
              Isi form di bawah — tim kami akan membaca pesanmu.
            </p>
            <input
              className="input-modern"
              placeholder="Nama"
              autoComplete="name"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
            />
            <input
              className="input-modern"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
            />
            <textarea
              className="input-modern min-h-36 resize-y py-3"
              placeholder="Pesan"
              rows={5}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
            />
            <button type="submit" className="btn-primary w-full py-3 sm:w-auto">
              Kirim
            </button>
          </form>
        </div>
      </section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-y border-red-100/50 bg-linear-to-r from-red-600 via-red-500 to-red-600 px-4 py-12 text-center text-white sm:py-14"
      >
        <div className="container-base">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-100">
            Butuh bantuan atau partnership?
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Hubungi tim Mamuri
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-red-100 sm:text-base">
            Ceritakan kebutuhanmu — kami bantu arahkan ke produk dan program
            yang tepat.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/90 bg-white px-8 py-3 text-base font-bold text-red-600 shadow-lg transition hover:bg-red-50"
          >
            Hubungi Admin
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
