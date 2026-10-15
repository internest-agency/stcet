"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import { deleteScholarship, saveScholarship } from "@/src/app/admin/(protected)/scholarships/actions";

type Scholarship = {
  id: number;
  name: string;
  description: string | null;
  eligibility: string | null;
  financialBenefit: string | null;
  incomeLimit: string | null;
  applicationInstructions: string | null;
  applicationUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const inputClass = "mt-1.5 min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";

function ScholarshipForm({ scholarship, canPublish, onCancel }: { scholarship?: Scholarship; canPublish: boolean; onCancel?: () => void }) {
  return (
    <form action={saveScholarship} className="space-y-4">
      {scholarship ? <input name="id" type="hidden" value={scholarship.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">Scholarship name<input className={inputClass} defaultValue={scholarship?.name ?? ""} maxLength={191} name="name" required /></label>
        <label className="block text-sm font-semibold text-gray-700">Official application URL<input className={inputClass} defaultValue={scholarship?.applicationUrl ?? ""} name="applicationUrl" placeholder="https://…" type="url" /></label>
        <label className="block text-sm font-semibold text-gray-700">Financial benefit<textarea className={inputClass} defaultValue={scholarship?.financialBenefit ?? ""} name="financialBenefit" rows={3} /></label>
        <label className="block text-sm font-semibold text-gray-700">Income limits<textarea className={inputClass} defaultValue={scholarship?.incomeLimit ?? ""} name="incomeLimit" rows={3} /></label>
      </div>
      <label className="block text-sm font-semibold text-gray-700">Description<textarea className={inputClass} defaultValue={scholarship?.description ?? ""} name="description" rows={3} /></label>
      <label className="block text-sm font-semibold text-gray-700">Eligibility criteria<textarea className={inputClass} defaultValue={scholarship?.eligibility ?? ""} name="eligibility" rows={3} /></label>
      <label className="block text-sm font-semibold text-gray-700">Application instructions<textarea className={inputClass} defaultValue={scholarship?.applicationInstructions ?? ""} name="applicationInstructions" rows={3} /></label>
      <div className="flex flex-wrap items-end gap-4">
        <label className="block w-28 text-sm font-semibold text-gray-700">Display order<input className={inputClass} defaultValue={scholarship?.sortOrder ?? 0} min={0} name="sortOrder" type="number" /></label>
        {canPublish ? <label className="flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-700"><input className="size-4 accent-primary-700" defaultChecked={scholarship?.isPublished ?? false} name="isPublished" type="checkbox" />Published</label> : <input name="isPublished" type="hidden" value="off" />}
        <button className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800"><Save aria-hidden className="size-4" />{scholarship ? "Save scholarship" : "Add scholarship"}</button>
        {onCancel ? <button className="min-h-10 rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={onCancel} type="button">Cancel</button> : null}
      </div>
    </form>
  );
}

export default function ScholarshipsManager({ scholarships, canPublish }: { scholarships: Scholarship[]; canPublish: boolean }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const filtered = useMemo(() => scholarships.filter((item) => (status === "all" || (status === "published" ? item.isPublished : !item.isPublished)) && `${item.name} ${item.description ?? ""} ${item.eligibility ?? ""}`.toLowerCase().includes(query.toLowerCase())), [query, scholarships, status]);

  return <div className="space-y-6">
    <section className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="font-bold text-gray-900">Scholarships</h3><p className="mt-1 text-sm text-gray-500">Search, draft, publish, and order verified financial-support records.</p></div><button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800" onClick={() => { setAdding((value) => !value); setEditing(null); }} type="button"><Plus aria-hidden className="size-4" />Add scholarship</button></div>
      {adding ? <div className="mt-5 border-t border-gray-200 pt-5"><ScholarshipForm canPublish={canPublish} onCancel={() => setAdding(false)} /></div> : null}
    </section>
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]"><label className="relative"><Search aria-hidden className="absolute left-3 top-3 size-4 text-gray-400" /><span className="sr-only">Search scholarships</span><input className="min-h-10 w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm" onChange={(event) => setQuery(event.target.value)} placeholder="Search scholarships" value={query} /></label><select className="min-h-10 rounded-md border border-gray-300 px-3 text-sm" onChange={(event) => setStatus(event.target.value as typeof status)} value={status}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
    {filtered.length ? <div className="space-y-4">{filtered.map((scholarship) => <article className="rounded-md border border-gray-200 bg-white p-4 sm:p-5" key={scholarship.id}><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-bold text-gray-900">{scholarship.name}</h3><p className="mt-1 text-xs text-gray-500">Order {scholarship.sortOrder} · Updated {scholarship.updatedAt.toLocaleDateString()}</p><span className={`mt-2 inline-flex rounded-sm px-2 py-1 text-xs font-bold ${scholarship.isPublished ? "bg-secondary-50 text-secondary-800" : "bg-gray-100 text-gray-600"}`}>{scholarship.isPublished ? "Published" : "Draft"}</span></div>{canPublish ? <form action={deleteScholarship} onSubmit={(event) => { if (!window.confirm(`Delete “${scholarship.name}”? This cannot be undone.`)) event.preventDefault(); }}><input name="id" type="hidden" value={scholarship.id} /><button aria-label={`Delete ${scholarship.name}`} className="grid size-10 place-items-center rounded-md text-red-700 hover:bg-red-50" title="Delete scholarship" type="submit"><Trash2 aria-hidden className="size-4" /></button></form> : null}</div>{editing === scholarship.id ? <div className="mt-5 border-t border-gray-200 pt-5"><ScholarshipForm canPublish={canPublish} scholarship={scholarship} onCancel={() => setEditing(null)} /></div> : <div className="mt-4 flex gap-3"><button className="min-h-10 rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => { setEditing(scholarship.id); setAdding(false); }} type="button">Edit</button>{scholarship.isPublished && !canPublish ? <p className="self-center text-sm text-gray-500">Published records can only be changed by an administrator.</p> : null}</div>}</article>)}</div> : <div className="rounded-md border border-dashed border-gray-300 bg-white px-5 py-12 text-center"><p className="font-semibold text-gray-800">No scholarships match this filter</p><p className="mt-1 text-sm text-gray-500">Add a verified scholarship or adjust the search.</p></div>}
  </div>;
}
