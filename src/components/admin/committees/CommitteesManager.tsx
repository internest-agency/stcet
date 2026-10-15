"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  deleteCommitteeMember,
  moveCommitteeMember,
  saveCommitteeMember,
} from "@/src/app/admin/(protected)/committees/actions";

type Committee = {
  id: number;
  slug: string;
  name: string;
  isPublished: boolean;
};

type Member = {
  id: number;
  committeeSlug: string;
  committeeName: string;
  memberName: string;
  designation: string | null;
  role: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
};

const inputClass = "mt-1 min-h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm";
const cardClass = "rounded-md border border-gray-200 bg-white p-5";
const actionButton =
  "grid size-9 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function MemberForm({
  committee,
  value,
  canPublish,
  nextOrder,
  roleOptions,
  onCancel,
}: {
  committee: Committee;
  value?: Member;
  canPublish: boolean;
  nextOrder: number;
  roleOptions: string[];
  onCancel: () => void;
}) {
  return (
    <form
      action={saveCommitteeMember}
      className="grid gap-3 rounded-md border border-primary-200 bg-primary-50/40 p-4 md:grid-cols-2"
    >
      {value ? <input name="id" type="hidden" value={value.id} /> : null}
      <input name="committeeSlug" type="hidden" value={committee.slug} />
      <input name="committeeName" type="hidden" value={committee.name} />
      <label>
        Member name
        <input className={inputClass} defaultValue={value?.memberName ?? ""} name="memberName" required />
      </label>
      <label>
        Designation
        <input className={inputClass} defaultValue={value?.designation ?? ""} name="designation" />
      </label>
      <label>
        Role
        <input
          className={inputClass}
          defaultValue={value?.role ?? ""}
          list="committee-role-options"
          name="role"
          placeholder="e.g. Committee"
        />
      </label>
      <datalist id="committee-role-options">
        {roleOptions.map((role) => (
          <option key={role} value={role} />
        ))}
      </datalist>
      <label>
        Order
        <input className={inputClass} defaultValue={value?.sortOrder ?? nextOrder} min="0" name="sortOrder" type="number" />
      </label>
      <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold">
        <input defaultChecked={value?.isActive ?? true} name="isActive" type="checkbox" />
        Active
      </label>
      {canPublish ? (
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold">
          <input defaultChecked={value?.isPublished ?? false} name="isPublished" type="checkbox" />
          Published
        </label>
      ) : (
        <input name="isPublished" type="hidden" value="off" />
      )}
      <div className="flex gap-2 md:col-span-2">
        <button className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 text-sm font-bold text-white hover:bg-primary-800">
          <Save aria-hidden className="size-4" />
          {value ? "Save member" : "Add member"}
        </button>
        <button
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50"
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden className="size-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CommitteesManager({
  committees,
  members,
  selectedSlug,
  canPublish,
}: {
  committees: Committee[];
  members: Member[];
  selectedSlug: string;
  canPublish: boolean;
}) {
  const [memberEditor, setMemberEditor] = useState<"new" | number | null>(null);

  const selected = committees.find((committee) => committee.slug === selectedSlug) ?? null;
  const committeeMembers = selected ? members.filter((member) => member.committeeSlug === selected.slug) : [];
  const roleOptions = Array.from(
    new Set(committeeMembers.map((member) => member.role).filter((role): role is string => Boolean(role))),
  );
  const nextOrder = committeeMembers.reduce((max, member) => Math.max(max, member.sortOrder + 1), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className={cardClass}>
        <h3 className="font-bold">Committees</h3>

        {committees.length ? (
          <nav aria-label="Committees" className="mt-4 space-y-1">
            {committees.map((committee) => {
              const active = committee.slug === selectedSlug;
              const count = members.filter((member) => member.committeeSlug === committee.slug).length;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-md border px-3 py-2 text-sm transition ${
                    active
                      ? "border-primary-300 bg-primary-50 text-primary-900"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }`}
                  href={`/admin/committees?committee=${encodeURIComponent(committee.slug)}`}
                  key={committee.id}
                >
                  <span className="block font-semibold">{committee.name}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {committee.isPublished ? "Published" : "Draft"} · {count} {count === 1 ? "member" : "members"}
                  </span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No committees have been configured.</p>
        )}
      </aside>

      <div className="space-y-6">
        {selected ? (
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">Committee members</h3>
                <p className="mt-1 text-sm text-gray-500">Members shown on “{selected.name}”.</p>
              </div>
              <button
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-primary-700 px-3 text-sm font-bold text-white hover:bg-primary-800"
                onClick={() => setMemberEditor((current) => (current === "new" ? null : "new"))}
                type="button"
              >
                <Plus aria-hidden className="size-4" />
                Add member
              </button>
            </div>

            {memberEditor === "new" ? (
              <div className="mt-4">
                <MemberForm
                  canPublish={canPublish}
                  committee={selected}
                  nextOrder={nextOrder}
                  onCancel={() => setMemberEditor(null)}
                  roleOptions={roleOptions}
                />
              </div>
            ) : null}

            {committeeMembers.length ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-160 text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-bold" scope="col">
                        #
                      </th>
                      <th className="px-4 py-3 font-bold" scope="col">
                        Member
                      </th>
                      <th className="px-4 py-3 font-bold" scope="col">
                        Designation
                      </th>
                      <th className="px-4 py-3 font-bold" scope="col">
                        Role
                      </th>
                      <th className="px-4 py-3 font-bold" scope="col">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right font-bold" scope="col">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {committeeMembers.map((member, index) => (
                      <Fragment key={member.id}>
                        <tr className="hover:bg-gray-50/70">
                          <td className="px-4 py-3 text-gray-500">{pad(index + 1)}</td>
                          <td className="px-4 py-3 font-bold text-gray-900">{member.memberName}</td>
                          <td className="px-4 py-3 text-gray-600">{member.designation ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-600">{member.role ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span className="flex flex-wrap gap-1.5">
                              <span
                                className={`inline-flex rounded-sm px-2 py-1 text-xs font-bold ${
                                  member.isActive ? "bg-secondary-50 text-secondary-800" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {member.isActive ? "Active" : "Inactive"}
                              </span>
                              <span
                                className={`inline-flex rounded-sm px-2 py-1 text-xs font-bold ${
                                  member.isPublished
                                    ? "bg-secondary-50 text-secondary-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {member.isPublished ? "Published" : "Draft"}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                aria-label={`Edit ${member.memberName}`}
                                className={actionButton}
                                onClick={() =>
                                  setMemberEditor((current) => (current === member.id ? null : member.id))
                                }
                                type="button"
                              >
                                <Pencil aria-hidden className="size-4" />
                              </button>
                              <form action={moveCommitteeMember}>
                                <input name="id" type="hidden" value={member.id} />
                                <input name="direction" type="hidden" value="up" />
                                <button
                                  aria-label={`Move ${member.memberName} up`}
                                  className={actionButton}
                                  disabled={index === 0}
                                  type="submit"
                                >
                                  <ArrowUp aria-hidden className="size-4" />
                                </button>
                              </form>
                              <form action={moveCommitteeMember}>
                                <input name="id" type="hidden" value={member.id} />
                                <input name="direction" type="hidden" value="down" />
                                <button
                                  aria-label={`Move ${member.memberName} down`}
                                  className={actionButton}
                                  disabled={index === committeeMembers.length - 1}
                                  type="submit"
                                >
                                  <ArrowDown aria-hidden className="size-4" />
                                </button>
                              </form>
                              {canPublish ? (
                                <form
                                  action={deleteCommitteeMember}
                                  onSubmit={(event) => {
                                    if (!window.confirm(`Remove “${member.memberName}”?`)) {
                                      event.preventDefault();
                                    }
                                  }}
                                >
                                  <input name="id" type="hidden" value={member.id} />
                                  <button
                                    aria-label={`Remove ${member.memberName}`}
                                    className="grid size-9 place-items-center rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                                    type="submit"
                                  >
                                    <Trash2 aria-hidden className="size-4" />
                                  </button>
                                </form>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                        {memberEditor === member.id ? (
                          <tr>
                            <td className="bg-primary-50/30 p-0" colSpan={6}>
                              <div className="p-4">
                                <MemberForm
                                  canPublish={canPublish}
                                  committee={selected}
                                  nextOrder={nextOrder}
                                  onCancel={() => setMemberEditor(null)}
                                  roleOptions={roleOptions}
                                  value={member}
                                />
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No committee members have been added yet.
              </p>
            )}
          </section>
        ) : (
          <section className={cardClass}>
            <p className="text-sm text-gray-500">No committees have been configured.</p>
          </section>
        )}
      </div>
    </div>
  );
}
