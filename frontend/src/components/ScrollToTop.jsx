import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Saat pathname berubah (bukan hanya hash di /), scroll ke atas — mis. buka Dashboard dari halaman panjang. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
