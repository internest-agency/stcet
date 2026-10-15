"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Info,
  Link as LinkIcon,
  Phone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import TNEAStepForm from "@/src/components/admin/admissions/TNEAStepForm";
import {
  saveAdmissionsIntro,
  saveAdmissionRoute,
  deleteAdmissionRoute,
  deleteTNEAStep,
  saveManagementQuota,
  saveImportantNotice,
  deleteImportantNotice,
  saveApplicationLink,
  deleteApplicationLink,
  saveAdmissionContact,
  deleteAdmissionContact,
} from "@/src/app/admin/(protected)/admissions/actions";

interface AdmissionsManagerProps {
  canPublish: boolean;
  data: {
    intro: any;
    routes: any[];
    tneaSteps: any[];
    quotaInfo: any;
    notices: any[];
    links: any[];
    contacts: any[];
  };
}

export default function AdmissionsManager({
  canPublish,
  data,
}: AdmissionsManagerProps) {
  const [activeTab, setActiveTab] = useState<
    "intro" | "routes" | "tnea" | "quota" | "notices" | "links" | "contacts"
  >("intro");

  const [editingRoute, setEditingRoute] = useState<any | null>(null);
  const [routeImage, setRouteImage] = useState<string>("");
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const [editingTnea, setEditingTnea] = useState<any | null>(null);
  const [isTneaModalOpen, setIsTneaModalOpen] = useState(false);

  const [editingNotice, setEditingNotice] = useState<any | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const [editingLink, setEditingLink] = useState<any | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [quotaEligibility, setQuotaEligibility] = useState<string>(
    data.quotaInfo?.eligibility || "",
  );

  const tabs = [
    { id: "intro", label: "Introduction", icon: Info },
    { id: "routes", label: "Admission Routes", icon: GraduationCap, count: data.routes.length },
    { id: "tnea", label: "TNEA Journey", icon: BookOpen, count: data.tneaSteps.length },
    { id: "quota", label: "Management Quota", icon: FileText },
    { id: "notices", label: "Notices", icon: Info, count: data.notices.length },
    { id: "links", label: "Links", icon: LinkIcon, count: data.links.length },
    { id: "contacts", label: "Contacts", icon: Phone, count: data.contacts.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary-700 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {"count" in tab && tab.count !== undefined && (
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                    isActive ? "bg-primary-800 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: ADMISSION ROUTES */}
      {activeTab === "routes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Admission Routes</h3>
            <button
              onClick={() => {
                setEditingRoute(null);
                setRouteImage("");
                setIsRouteModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-800"
            >
              <Plus className="size-4" /> Add Route
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.routes.map((route) => (
              <div
                key={route.id}
                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-accent-600 uppercase tracking-wider">
                        {route.number || "Route"}
                      </span>
                      <h4 className="mt-1 text-base font-bold text-gray-900">
                        {route.title}
                      </h4>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        route.isPublished
                          ? "bg-secondary-100 text-secondary-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {route.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  {route.imagePath && (
                    <div className="relative mt-3 h-32 w-full overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={route.imagePath}
                        alt={route.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {route.description}
                  </p>
                  {route.linkHref && (
                    <p className="mt-2 text-xs text-primary-700 truncate">
                      Link: {route.linkText || route.linkHref}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">Order: {route.sortOrder}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRoute(route);
                        setRouteImage(route.imagePath || "");
                        setIsRouteModalOpen(true);
                      }}
                      className="rounded px-2.5 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
                    >
                      Edit
                    </button>
                    {canPublish && (
                      <form action={deleteAdmissionRoute}>
                        <input type="hidden" name="id" value={route.id} />
                        <button
                          type="submit"
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this route?")) {
                              e.preventDefault();
                            }
                          }}
                          className="rounded px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {data.routes.length === 0 && (
              <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No admission routes configured. Click "Add Route" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TNEA JOURNEY */}
      {activeTab === "tnea" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">TNEA Application Steps</h3>
            <button
              onClick={() => {
                setEditingTnea(null);
                setIsTneaModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-800"
            >
              <Plus className="size-4" /> Add Step
            </button>
          </div>

          <div className="space-y-3">
            {data.tneaSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-800">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                    <p className="mt-0.5 text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      step.isPublished
                        ? "bg-secondary-100 text-secondary-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {step.isPublished ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => {
                      setEditingTnea(step);
                      setIsTneaModalOpen(true);
                    }}
                    className="rounded px-2 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
                  >
                    Edit
                  </button>
                  {canPublish && (
                    <form action={deleteTNEAStep}>
                      <input type="hidden" name="id" value={step.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Delete this TNEA step?")) e.preventDefault();
                        }}
                        className="rounded px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
            {data.tneaSteps.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No TNEA steps added yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: NOTICES */}
      {activeTab === "notices" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Important Notices</h3>
            <button
              onClick={() => {
                setEditingNotice(null);
                setIsNoticeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-800"
            >
              <Plus className="size-4" /> Add Notice
            </button>
          </div>

          <div className="space-y-3">
            {data.notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-gray-900">{notice.title}</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        notice.isPublished
                          ? "bg-secondary-100 text-secondary-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {notice.isPublished ? "Published" : "Draft"}
                    </span>
                    <button
                      onClick={() => {
                        setEditingNotice(notice);
                        setIsNoticeModalOpen(true);
                      }}
                      className="rounded px-2 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
                    >
                      Edit
                    </button>
                    {canPublish && (
                      <form action={deleteImportantNotice}>
                        <input type="hidden" name="id" value={notice.id} />
                        <button
                          type="submit"
                          onClick={(e) => {
                            if (!confirm("Delete notice?")) e.preventDefault();
                          }}
                          className="rounded px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600 whitespace-pre-line">{notice.content}</p>
                {notice.linkUrl && (
                  <p className="mt-2 text-xs text-primary-700">Link: {notice.linkUrl}</p>
                )}
              </div>
            ))}
            {data.notices.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No notices published yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: APPLICATION LINKS */}
      {activeTab === "links" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Application Links</h3>
            <button
              onClick={() => {
                setEditingLink(null);
                setIsLinkModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-800"
            >
              <Plus className="size-4" /> Add Link
            </button>
          </div>

          <div className="space-y-3">
            {data.links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{link.name}</h4>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary-700 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingLink(link);
                      setIsLinkModalOpen(true);
                    }}
                    className="rounded px-2 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
                  >
                    Edit
                  </button>
                  {canPublish && (
                    <form action={deleteApplicationLink}>
                      <input type="hidden" name="id" value={link.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Delete application link?")) e.preventDefault();
                        }}
                        className="rounded px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
            {data.links.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No links configured.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CONTACTS */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Admission Contacts</h3>
            <button
              onClick={() => {
                setEditingContact(null);
                setIsContactModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-800"
            >
              <Plus className="size-4" /> Add Contact
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {data.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-700">
                    {contact.contactType || "Contact"}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">{contact.title}</h4>
                  <p className="mt-1 text-sm font-semibold text-primary-800">{contact.value}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingContact(contact);
                      setIsContactModalOpen(true);
                    }}
                    className="rounded px-2 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
                  >
                    Edit
                  </button>
                  {canPublish && (
                    <form action={deleteAdmissionContact}>
                      <input type="hidden" name="id" value={contact.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Delete contact item?")) e.preventDefault();
                        }}
                        className="rounded px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
            {data.contacts.length === 0 && (
              <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No admission contacts added.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: MANAGEMENT QUOTA */}
      {activeTab === "quota" && (
        <form action={saveManagementQuota} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
          <input type="hidden" name="id" value={data.quotaInfo?.id || ""} />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Management Quota Details</h3>
            <p className="text-xs text-gray-500">Guidelines, eligibility, and process for management quota admissions.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600">Section Title</label>
            <input
              type="text"
              name="title"
              defaultValue={data.quotaInfo?.title || "Management Quota Admission"}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={data.quotaInfo?.description || ""}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <RichTextEditor
              label="Eligibility Criteria"
              name="eligibility"
              value={quotaEligibility}
              onChange={setQuotaEligibility}
              minHeight={160}
              hint="Formatting is supported. Headings, lists, links and emphasis are preserved and sanitized before publishing."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="quotaPublished"
              name="isPublished"
              defaultChecked={data.quotaInfo ? data.quotaInfo.isPublished : true}
              className="size-4 text-primary-700"
            />
            <label htmlFor="quotaPublished" className="text-sm font-semibold text-gray-700">
              Published on website
            </label>
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-800"
          >
            Save Management Quota
          </button>
        </form>
      )}

      {/* TAB: INTRODUCTION */}
      {activeTab === "intro" && (
        <form action={saveAdmissionsIntro} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
          <input type="hidden" name="id" value={data.intro?.id || ""} />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Admissions Page Introduction</h3>
            <p className="text-xs text-gray-500">Configure hero text and introduction for the public admissions page.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600">Hero Title</label>
            <input
              type="text"
              name="title"
              defaultValue={data.intro?.title || "Begin Your Engineering Journey."}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              defaultValue={data.intro?.subtitle || "Admissions for Academic Year 2026–27"}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={
                data.intro?.description ||
                "Admissions are open for the academic year through TNEA Counselling and Management Quota, subject to applicable eligibility and admission norms."
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="introPublished"
              name="isPublished"
              defaultChecked={data.intro ? data.intro.isPublished : true}
              className="size-4 text-primary-700"
            />
            <label htmlFor="introPublished" className="text-sm font-semibold text-gray-700">
              Published on website
            </label>
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-800"
          >
            Save Introduction
          </button>
        </form>
      )}

      {/* ROUTE MODAL */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">
                {editingRoute ? "Edit Admission Route" : "Add Admission Route"}
              </h3>
              <button onClick={() => setIsRouteModalOpen(false)}>
                <X className="size-5 text-gray-400" />
              </button>
            </div>
            <form action={saveAdmissionRoute} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={editingRoute?.id || ""} />
              <input type="hidden" name="imagePath" value={routeImage} />

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600">Number</label>
                  <input
                    type="text"
                    name="number"
                    defaultValue={editingRoute?.number || "01"}
                    placeholder="01"
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-600">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingRoute?.title || ""}
                    required
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingRoute?.description || ""}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>

              <ImageUploadField
                label="Route Image"
                category="admissions"
                value={routeImage}
                onChange={setRouteImage}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600">Button Link</label>
                  <input
                    type="text"
                    name="linkHref"
                    defaultValue={editingRoute?.linkHref || ""}
                    placeholder="#tnea-journey or /enquire-now"
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600">Button Label</label>
                  <input
                    type="text"
                    name="linkText"
                    defaultValue={editingRoute?.linkText || "Explore Process"}
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-600">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingRoute?.sortOrder ?? 0}
                    className="mt-1 w-24 rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="routePub"
                    name="isPublished"
                    defaultChecked={editingRoute ? editingRoute.isPublished : true}
                    className="size-4"
                  />
                  <label htmlFor="routePub" className="text-sm font-semibold">
                    Published
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TNEA MODAL */}
      {isTneaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">
                {editingTnea ? "Edit TNEA Step" : "Add TNEA Step"}
              </h3>
              <button onClick={() => setIsTneaModalOpen(false)}>
                <X className="size-5 text-gray-400" />
              </button>
            </div>
            <TNEAStepForm
              key={editingTnea?.id ?? "new"}
              step={editingTnea}
              defaultStepNumber={data.tneaSteps.length + 1}
              onCancel={() => setIsTneaModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* NOTICE MODAL */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">
                {editingNotice ? "Edit Notice" : "Add Important Notice"}
              </h3>
              <button onClick={() => setIsNoticeModalOpen(false)}>
                <X className="size-5 text-gray-400" />
              </button>
            </div>
            <form action={saveImportantNotice} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={editingNotice?.id || ""} />
              <div>
                <label className="block text-xs font-bold text-gray-600">Notice Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingNotice?.title || ""}
                  required
                  placeholder="TNEA 2026 Counselling Dates"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600">Content</label>
                <textarea
                  name="content"
                  rows={4}
                  defaultValue={editingNotice?.content || ""}
                  required
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600">External Link (optional)</label>
                <input
                  type="text"
                  name="linkUrl"
                  defaultValue={editingNotice?.linkUrl || ""}
                  placeholder="https://tneaonline.org"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-600">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingNotice?.sortOrder ?? 0}
                    className="mt-1 w-24 rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="notPub"
                    name="isPublished"
                    defaultChecked={editingNotice ? editingNotice.isPublished : true}
                    className="size-4"
                  />
                  <label htmlFor="notPub" className="text-sm font-semibold">
                    Published
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION LINK MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">
                {editingLink ? "Edit Application Link" : "Add Application Link"}
              </h3>
              <button onClick={() => setIsLinkModalOpen(false)}>
                <X className="size-5 text-gray-400" />
              </button>
            </div>
            <form action={saveApplicationLink} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={editingLink?.id || ""} />
              <div>
                <label className="block text-xs font-bold text-gray-600">Link Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingLink?.name || ""}
                  required
                  placeholder="Official TNEA Portal"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600">URL</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingLink?.url || "https://"}
                  required
                  placeholder="https://www.tneaonline.org"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-600">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingLink?.sortOrder ?? 0}
                    className="mt-1 w-24 rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="lnkPub"
                    name="isPublished"
                    defaultChecked={editingLink ? editingLink.isPublished : true}
                    className="size-4"
                  />
                  <label htmlFor="lnkPub" className="text-sm font-semibold">
                    Published
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">
                {editingContact ? "Edit Admission Contact" : "Add Admission Contact"}
              </h3>
              <button onClick={() => setIsContactModalOpen(false)}>
                <X className="size-5 text-gray-400" />
              </button>
            </div>
            <form action={saveAdmissionContact} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={editingContact?.id || ""} />
              <div>
                <label className="block text-xs font-bold text-gray-600">Contact Type</label>
                <input
                  type="text"
                  name="contactType"
                  defaultValue={editingContact?.contactType || "Phone"}
                  placeholder="Phone / Email / Helpdesk"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600">Title / Label</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingContact?.title || ""}
                  required
                  placeholder="Admission Hotline"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600">Value (Number/Email)</label>
                <input
                  type="text"
                  name="value"
                  defaultValue={editingContact?.value || ""}
                  required
                  placeholder="+91 96003 12030"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-600">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingContact?.sortOrder ?? 0}
                    className="mt-1 w-24 rounded border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="cntPub"
                    name="isPublished"
                    defaultChecked={editingContact ? editingContact.isPublished : true}
                    className="size-4"
                  />
                  <label htmlFor="cntPub" className="text-sm font-semibold">
                    Published
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
