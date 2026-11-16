"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/src/app/admin/(protected)/users/actions";

type User = {
  id: number;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "CONTENT_EDITOR";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const input =
  "mt-1 min-h-10 w-full rounded border border-gray-300 px-3 py-2 text-sm";

function RoleSelect({ value }: { value: User["role"] }) {
  return (
    <select className={input} defaultValue={value} name="role">
      <option value="SUPER_ADMIN">Administrator</option>
      <option value="CONTENT_EDITOR">Editor</option>
    </select>
  );
}

export default function UsersManager({ users }: { users: User[] }) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, users],
  );

  return (
    <div className="space-y-5">
      <section className="rounded border border-gray-200 bg-white p-5">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="font-bold">Administrative users</h3>
            <p className="mt-1 text-sm text-gray-500">
              Passwords are stored securely and never displayed.
            </p>
          </div>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded bg-primary-700 px-3 text-sm font-bold text-white"
            onClick={() => setAdding(!adding)}
            type="button"
          >
            <Plus className="size-4" />
            Add user
          </button>
        </div>

        {adding ? (
          <form
            action={createAdminUser}
            className="mt-4 grid gap-3 border-t pt-4 md:grid-cols-2"
          >
            <label>
              Name
              <input className={input} name="name" required />
            </label>
            <label>
              Email
              <input className={input} name="email" required type="email" />
            </label>
            <label>
              Temporary password
              <input
                className={input}
                minLength={12}
                name="password"
                required
                type="password"
              />
            </label>
            <label>
              Role
              <RoleSelect value="CONTENT_EDITOR" />
            </label>
            <button className="inline-flex min-h-10 items-center gap-2 rounded bg-primary-700 px-4 text-sm font-bold text-white">
              <Save className="size-4" />
              Create user
            </button>
          </form>
        ) : null}
      </section>

      <label className="relative block">
        <Search className="absolute left-3 top-3 size-4 text-gray-400" />
        <input
          className="min-h-10 w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users"
          value={query}
        />
      </label>

      {filtered.map((user) => (
        <article className="rounded border border-gray-200 bg-white p-4" key={user.id}>
          <form action={updateAdminUser} className="grid gap-3 md:grid-cols-2">
            <input name="id" type="hidden" value={user.id} />
            <label>
              Name
              <input className={input} defaultValue={user.name} name="name" required />
            </label>
            <label>
              Email
              <input
                className={input}
                defaultValue={user.email}
                name="email"
                required
                type="email"
              />
            </label>
            <label>
              Role
              <RoleSelect value={user.role} />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold">
              <input defaultChecked={user.isActive} name="isActive" type="checkbox" />
              Active
            </label>
            <p className="text-xs text-gray-500">
              Created {new Date(user.createdAt).toLocaleDateString()} · Updated{" "}
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex min-h-10 items-center gap-2 rounded border border-gray-300 px-4 text-sm font-bold hover:bg-gray-50">
                <Save className="size-4" />
                Save user
              </button>
            </div>
          </form>

          <form
            action={deleteAdminUser}
            className="mt-3 border-t border-gray-100 pt-3"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  `Delete user "${user.name}" (${user.email})? This cannot be undone.`,
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <input name="id" type="hidden" value={user.id} />
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded border border-red-200 px-4 text-sm font-bold text-red-700 hover:bg-red-50"
              type="submit"
            >
              <Trash2 className="size-4" />
              Delete user
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}
