import HomeTopLink from "./HomeTopLink";
import SectionLink from "./SectionLink";

const MAP_EMBED = import.meta.env.VITE_OFFICE_MAP_EMBED_URL || "";
const MAP_LINK =
  import.meta.env.VITE_OFFICE_MAP_LINK ||
  "https://www.google.com/maps/search/?api=1&query=Mamuri+Indonesia";

const OFFICE_ADDRESS =
  import.meta.env.VITE_OFFICE_ADDRESS ||
  "Kantor Mamuri — atur alamat di variabel VITE_OFFICE_ADDRESS pada .env";
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "info@mamuri.id";
const CONTACT_WHATSAPP = import.meta.env.VITE_CONTACT_WHATSAPP || "";
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || "";

const waLink = CONTACT_WHATSAPP
  ? `https://wa.me/${String(CONTACT_WHATSAPP).replace(/\D/g, "")}`
  : MAP_LINK;

const SOCIAL = [
  { key: "youtube", href: import.meta.env.VITE_SOCIAL_YOUTUBE, icon: "ri-youtube-fill", label: "YouTube" },
  { key: "tiktok", href: import.meta.env.VITE_SOCIAL_TIKTOK, icon: "ri-tiktok-fill", label: "TikTok" },
  { key: "instagram", href: import.meta.env.VITE_SOCIAL_INSTAGRAM, icon: "ri-instagram-line", label: "Instagram" },
  { key: "linkedin", href: import.meta.env.VITE_SOCIAL_LINKEDIN, icon: "ri-linkedin-box-fill", label: "LinkedIn" },
];

function ContactRow({ icon, children }) {
  return (
    <div className="flex gap-2.5 text-sm leading-snug text-zinc-400">
      <i className={`${icon} mt-0.5 shrink-0 text-base text-zinc-500`} aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-zinc-900 text-zinc-300">
      <div className="container-base py-6 sm:py-7 md:py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="min-w-0">
            <HomeTopLink className="inline-flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Mamuri"
                className="h-9 w-9 rounded object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-base font-black text-white">Mamuri</span>
            </HomeTopLink>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400 sm:text-sm">
              Bumbu masak praktis siap pakai untuk rumah tangga dan usaha kuliner. Area member untuk materi belajar dan
              dukungan mitra.
            </p>
            <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-zinc-500" aria-label="Footer">
              <HomeTopLink className="transition hover:text-red-400">
                Home
              </HomeTopLink>
              <SectionLink sectionId="about" className="transition hover:text-red-400">
                About
              </SectionLink>
              <SectionLink sectionId="contact" className="transition hover:text-red-400">
                Contact
              </SectionLink>
            </nav>
          </div>

          {/* Hubungi kami */}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white">Hubungi Kami</h2>
            <div className="mt-3 space-y-2.5">
              <ContactRow icon="ri-map-pin-line">
                <span>{OFFICE_ADDRESS}</span>
              </ContactRow>
              <ContactRow icon="ri-mail-line">
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-zinc-300 transition hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </ContactRow>
              <ContactRow icon="ri-whatsapp-line">
                {CONTACT_WHATSAPP ? (
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                    {CONTACT_WHATSAPP}
                  </a>
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </ContactRow>
              <ContactRow icon="ri-phone-line">
                {CONTACT_PHONE ? (
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="transition hover:text-white">
                    {CONTACT_PHONE}
                  </a>
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </ContactRow>
            </div>
          </div>

          {/* Sosial */}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white">Follow Us</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {SOCIAL.map(({ key, href, icon, label }) =>
                href ? (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-zinc-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
                    aria-label={label}
                  >
                    <i className={icon} aria-hidden />
                  </a>
                ) : (
                  <span
                    key={key}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-lg text-zinc-600"
                    title={`${label} — tambahkan URL di .env`}
                    aria-hidden
                  >
                    <i className={icon} />
                  </span>
                )
              )}
            </div>
          </div>

          {/* Maps */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-bold text-white">Maps</h2>
            <div className="mt-2.5 overflow-hidden rounded-lg border border-white/10">
              {MAP_EMBED ? (
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Buka lokasi di Google Maps"
                >
                  <iframe
                    title="Lokasi kantor Mamuri"
                    src={MAP_EMBED}
                    className="pointer-events-none block h-36 w-full bg-zinc-800 sm:h-40"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <span className="pointer-events-none absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Buka di Maps
                  </span>
                </a>
              ) : (
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-36 flex-col items-center justify-center gap-2 bg-zinc-800/80 px-4 text-center transition hover:bg-zinc-800 sm:h-40"
                >
                  <span className="text-xs text-zinc-400">Peta embed belum diatur.</span>
                  <span className="text-xs font-semibold text-red-400 underline-offset-2 group-hover:underline">
                    Buka di Google Maps →
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-2.5 text-center">
        <p className="text-[11px] text-zinc-500 sm:text-xs">All right served Mamuri 2026</p>
      </div>
    </footer>
  );
}
