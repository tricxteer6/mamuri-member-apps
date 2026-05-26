import { Link, useLocation } from "react-router-dom";

/**
 * Link ke section di halaman utama (/#about, /#contact).
 * Di path lain: navigasi ke / lalu hash; di /: scroll halus + klik ulang tetap scroll.
 */
export default function SectionLink({ sectionId, className, children, ...props }) {
  const location = useLocation();
  const id = sectionId.replace(/^#/, "");
  const hash = `#${id}`;

  return (
    <Link
      to={{ pathname: "/", hash: id }}
      className={className}
      onClick={(e) => {
        if (location.pathname !== "/") return;
        if (location.hash === hash) {
          e.preventDefault();
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
