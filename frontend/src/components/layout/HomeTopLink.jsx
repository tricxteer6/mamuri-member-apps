import { Link, useLocation, useNavigate } from "react-router-dom";

/** Link ke beranda: dari halaman lain ke /; dari / scroll ke atas & hapus hash. */
export default function HomeTopLink({ className, children, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Link
      to="/"
      className={className}
      onClick={(e) => {
        if (location.pathname !== "/") return;
        e.preventDefault();
        navigate({ pathname: "/", hash: "" }, { replace: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
