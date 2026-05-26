import { useEffect, useState } from "react";
import { api } from "../../api/client";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminDashboard() {
  const [totals, setTotals] = useState({ users: 0, courses: 0, contents: 0 });

  useEffect(() => {
    Promise.all([api.get("/users"), api.get("/courses"), api.get("/content")]).then(
      ([usersRes, coursesRes, contentRes]) => {
        setTotals({
          users: usersRes.data?.length || 0,
          courses: coursesRes.data?.length || 0,
          contents: contentRes.data?.length || 0,
        });
      }
    );
  }, []);

  return (
    <main className="container-base flex flex-col gap-6 py-8 md:flex-row md:gap-8 md:py-10">
      <AdminSidebar />
      <section className="min-w-0 flex-1 md:mt-0">
        <div className="glass-card mb-4 p-5">
          <h1 className="heading-gradient text-2xl font-black">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-zinc-600">Kelola user, course, dan konten dengan alur kerja panel admin.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Users</p>
            <p className="mt-2 text-lg font-bold text-zinc-900">Total: {totals.users}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Courses</p>
            <p className="mt-2 text-lg font-bold text-zinc-900">Total: {totals.courses}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Contents</p>
            <p className="mt-2 text-lg font-bold text-zinc-900">Total: {totals.contents}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

