import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get("/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/users/${editingId}`, { name: form.name, email: form.email, role: form.role });
      toast.success("User berhasil diupdate");
    } else {
      await api.post("/users", form);
      toast.success("User berhasil dibuat");
    }
    setForm({ name: "", email: "", password: "", role: "user" });
    setEditingId(null);
    load();
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
  };

  const remove = async (id) => {
    await api.delete(`/users/${id}`);
    toast.success("User dihapus");
    load();
  };

  return (
    <main className="container-base flex flex-col gap-6 py-8 md:flex-row md:gap-8 md:py-10">
      <AdminSidebar />
      <section className="min-w-0 flex-1 md:mt-0">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900">Manage Users</h1>
        <form onSubmit={createUser} className="mb-4 grid gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2">
          <input className="rounded border border-zinc-200 bg-white p-2 outline-none focus:border-red-300" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded border border-zinc-200 bg-white p-2 outline-none focus:border-red-300" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded border border-zinc-200 bg-white p-2 outline-none focus:border-red-300" type="password" placeholder={editingId ? "Password diubah via reset terpisah" : "Password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} disabled={Boolean(editingId)} />
          <select className="rounded border border-zinc-200 bg-white p-2 outline-none focus:border-red-300" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="user">User</option><option value="admin">Admin</option></select>
          <div className="flex gap-2 md:col-span-2">
            <button className="rounded bg-red-500 px-3 py-2 text-white transition hover:bg-red-600">{editingId ? "Update User" : "Tambah User"}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", email: "", password: "", role: "user" }); }} className="rounded border border-zinc-300 px-3 py-2 text-zinc-700">Batal</button>}
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-[560px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-zinc-100">
                  <td className="px-3 py-2 font-medium text-zinc-800">{u.name}</td>
                  <td className="px-3 py-2 text-zinc-600">{u.email}</td>
                  <td className="px-3 py-2"><span className="rounded bg-zinc-100 px-2 py-1 text-xs">{u.role}</span></td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => startEdit(u)} className="mr-2 rounded border border-zinc-300 px-2 py-1">Edit</button>
                    <button onClick={() => remove(u.id)} className="rounded bg-red-500 px-2 py-1 text-white">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

