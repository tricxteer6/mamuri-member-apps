import { Link } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/courses", label: "Manage Courses" },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/content", label: "Manage Content" },
  { to: "/account/profile", label: "Profil" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-100 shadow-sm md:w-64">
      <h3 className="mb-1 text-lg font-bold text-white">Mamuri Admin</h3>
      <p className="mb-4 text-xs text-zinc-400">Inspired by dashboard workflow</p>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-zinc-800 md:min-h-0 md:py-2"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

