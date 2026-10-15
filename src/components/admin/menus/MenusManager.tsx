"use client";

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteMenuItem,
  saveMenuItem,
  type MenuActionResult,
} from "@/src/app/admin/(protected)/menus/actions";

type Item = {
  id: number;
  parentId: number | null;
  title: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  isPublished: boolean;
  _count?: { children: number };
};

type TreeItem = Item & { children: TreeItem[] };

type ParentOption = {
  id: number;
  label: string;
  depth: number;
};

type FlatRow = {
  node: TreeItem;
  depth: number;
  hasChildren: boolean;
  childCount: number;
};

const inputClass =
  "mt-1 h-9 w-full rounded-md border border-gray-300 bg-white px-2.5 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";
const labelClass = "block text-xs font-semibold text-gray-600";
const checkboxClass = "size-4 accent-primary-700";
const checkboxLabelClass =
  "flex items-center gap-2 text-xs font-medium text-gray-600";
const primaryButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-primary-700 px-3.5 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:opacity-60";
const ghostButton =
  "inline-flex min-h-9 items-center rounded-md border border-gray-300 px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60";

/** Wires a result-returning server action to a form while keeping it mounted. */
function useMenuAction(
  action: (formData: FormData) => Promise<MenuActionResult>,
  onSuccess?: (message: string) => void,
) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await action(formData);
      if (result.success) {
        onSuccess?.(result.message);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return { pending, error, submit };
}

function buildTree(items: Item[]): TreeItem[] {
  const nodes = new Map<number, TreeItem>();
  for (const item of items) nodes.set(item.id, { ...item, children: [] });

  const roots: TreeItem[] = [];
  for (const item of items) {
    const node = nodes.get(item.id) as TreeItem;
    if (item.parentId !== null && nodes.has(item.parentId)) {
      (nodes.get(item.parentId) as TreeItem).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function collectDescendantIds(id: number, items: Item[]): number[] {
  const childrenByParent = new Map<number, number[]>();
  for (const item of items) {
    if (item.parentId === null) continue;
    const siblings = childrenByParent.get(item.parentId) ?? [];
    siblings.push(item.id);
    childrenByParent.set(item.parentId, siblings);
  }

  const result: number[] = [];
  const stack = [...(childrenByParent.get(id) ?? [])];
  while (stack.length) {
    const current = stack.pop() as number;
    result.push(current);
    stack.push(...(childrenByParent.get(current) ?? []));
  }

  return result;
}

function flattenForOptions(nodes: TreeItem[], depth = 0): ParentOption[] {
  return nodes.flatMap((node) => [
    { id: node.id, label: `${"— ".repeat(depth)}${node.title}`, depth },
    ...flattenForOptions(node.children, depth + 1),
  ]);
}

function flattenVisible(
  nodes: TreeItem[],
  collapsed: Set<number>,
  depth = 0,
  out: FlatRow[] = [],
): FlatRow[] {
  for (const node of nodes) {
    const childCount = node.children.length;
    out.push({ node, depth, hasChildren: childCount > 0, childCount });
    if (childCount > 0 && !collapsed.has(node.id)) {
      flattenVisible(node.children, collapsed, depth + 1, out);
    }
  }
  return out;
}

function StatusBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "gray" | "green" | "navy";
}) {
  const tones = {
    gray: "bg-gray-100 text-gray-500",
    green: "bg-secondary-50 text-secondary-800",
    navy: "bg-primary-50 text-primary-700",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/50 p-4 sm:items-center"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900" id={titleId}>
            {title}
          </h3>
          <button
            aria-label="Close dialog"
            className="grid size-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MenuForm({
  item,
  parentOptions,
  canPublish,
  onCancel,
  onSaved,
}: {
  item?: Item;
  parentOptions: ParentOption[];
  canPublish: boolean;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useMenuAction(saveMenuItem, onSaved);

  if (item?.isPublished && !canPublish) {
    return (
      <div className="mt-4">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Published menu items can only be edited by an administrator. You can
          still add new items or edit drafts.
        </p>
        <div className="mt-4 flex justify-end">
          <button className={ghostButton} onClick={onCancel} type="button">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-4 grid gap-3" onSubmit={form.submit}>
      {item ? <input name="id" type="hidden" value={item.id} /> : null}

      <label className={labelClass}>
        Label
        <input
          className={inputClass}
          defaultValue={item?.title ?? ""}
          name="title"
          required
        />
      </label>

      <label className={labelClass}>
        Destination
        <input
          className={inputClass}
          defaultValue={item?.url ?? ""}
          name="url"
          placeholder="/admissions or https://…"
          required
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Parent
          <select
            className={inputClass}
            defaultValue={item?.parentId ?? ""}
            name="parentId"
          >
            <option value="">None / Top-level menu</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Order
          <input
            className={inputClass}
            defaultValue={item?.sortOrder ?? 0}
            min="0"
            name="sortOrder"
            type="number"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {canPublish ? (
          <label className={checkboxLabelClass}>
            <input
              className={checkboxClass}
              defaultChecked={item?.isPublished ?? false}
              name="isPublished"
              type="checkbox"
            />
            Published
          </label>
        ) : (
          <input name="isPublished" type="hidden" value="off" />
        )}

        <label className={checkboxLabelClass}>
          <input
            className={checkboxClass}
            defaultChecked={item?.isActive ?? true}
            name="isActive"
            type="checkbox"
          />
          Active
        </label>

        <label className={checkboxLabelClass}>
          <input
            className={checkboxClass}
            defaultChecked={item?.openInNewTab ?? false}
            name="openInNewTab"
            type="checkbox"
          />
          New tab
        </label>
      </div>

      {form.error ? (
        <p aria-live="polite" className="text-xs font-semibold text-red-700">
          {form.error}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          className={ghostButton}
          disabled={form.pending}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button className={primaryButton} disabled={form.pending} type="submit">
          {form.pending ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Save aria-hidden className="size-4" />
          )}
          {item ? "Save changes" : "Add item"}
        </button>
      </div>
    </form>
  );
}

function DeleteDialog({
  item,
  onClose,
  onDeleted,
}: {
  item: Item;
  onClose: () => void;
  onDeleted: (message: string) => void;
}) {
  const form = useMenuAction(deleteMenuItem, onDeleted);
  const childCount = item._count?.children ?? 0;

  return (
    <Modal onClose={onClose} title="Delete menu item?">
      <form className="mt-4" onSubmit={form.submit}>
        <input name="id" type="hidden" value={item.id} />
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle aria-hidden className="size-6 shrink-0" />
          <p className="text-sm font-semibold text-gray-800">{item.title}</p>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          This action will permanently delete this menu item and cannot be
          undone.
        </p>
        {childCount > 0 ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            This item has {childCount} child item{childCount === 1 ? "" : "s"}.
            Move or delete the child items before deleting this one.
          </p>
        ) : null}
        {form.error ? (
          <p
            aria-live="polite"
            className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
          >
            {form.error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className={ghostButton}
            disabled={form.pending}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            disabled={form.pending || childCount > 0}
            type="submit"
          >
            {form.pending ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <Trash2 aria-hidden className="size-4" />
            )}
            {form.pending ? "Deleting..." : "Delete item"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function MenuRow({
  row,
  collapsed,
  onToggle,
  onEdit,
  onDelete,
  canDelete,
}: {
  row: FlatRow;
  collapsed: boolean;
  onToggle: (id: number) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  canDelete: boolean;
}) {
  const { node, depth, hasChildren, childCount } = row;
  const actionButton =
    "grid size-7 place-items-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700";

  return (
    <div className="grid grid-cols-1 gap-2 border-b border-gray-100 px-3 py-3 last:border-b-0 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)_3.5rem_9rem_5rem] md:items-center md:gap-3">
      <div className="flex items-center gap-1.5">
        {hasChildren ? (
          <button
            aria-expanded={!collapsed}
            aria-label={`${collapsed ? "Expand" : "Collapse"} ${node.title}`}
            className="grid size-6 shrink-0 place-items-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={() => onToggle(node.id)}
            type="button"
          >
            <ChevronRight
              aria-hidden
              className={`size-4 transition ${collapsed ? "" : "rotate-90"}`}
            />
          </button>
        ) : (
          <span aria-hidden className="size-6 shrink-0" />
        )}
        <span
          className="truncate text-sm font-semibold text-gray-900"
          style={{ paddingLeft: depth * 8 }}
        >
          {node.title}
        </span>
        {hasChildren ? (
          <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {childCount}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 items-center gap-1.5">
        <span className="text-[10px] font-bold tracking-wide text-gray-400 uppercase md:hidden">
          URL
        </span>
        <span className="truncate font-mono text-xs text-gray-600">
          {node.url}
        </span>
        {node.openInNewTab ? (
          <ExternalLink
            aria-label="Opens in a new tab"
            className="size-3.5 shrink-0 text-gray-400"
          />
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 md:justify-center">
        <span className="text-[10px] font-bold tracking-wide text-gray-400 uppercase md:hidden">
          Order
        </span>
        <span className="text-xs text-gray-600">{node.sortOrder}</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <StatusBadge tone={node.isPublished ? "green" : "gray"}>
          {node.isPublished ? "Published" : "Draft"}
        </StatusBadge>
        <StatusBadge tone={node.isActive ? "navy" : "gray"}>
          {node.isActive ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <div className="flex items-center gap-1 md:justify-end">
        <button
          aria-label={`Edit ${node.title}`}
          className={actionButton}
          onClick={() => onEdit(node)}
          title="Edit"
          type="button"
        >
          <Pencil aria-hidden className="size-3.5" />
        </button>
        {canDelete ? (
          <button
            aria-label={`Delete ${node.title}`}
            className="grid size-7 place-items-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={() => onDelete(node)}
            title="Delete"
            type="button"
          >
            <Trash2 aria-hidden className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function MenusManager({
  items,
  canPublish,
}: {
  items: Item[];
  canPublish: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  const tree = buildTree(items);
  const rows = flattenVisible(tree, collapsed);
  const allOptions = flattenForOptions(tree);

  const optionsFor = (itemId: number | null): ParentOption[] => {
    if (itemId === null) return allOptions;
    const excluded = new Set<number>([
      itemId,
      ...collectDescendantIds(itemId, items),
    ]);
    return allOptions.filter((option) => !excluded.has(option.id));
  };

  const toggle = (id: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleSaved = (text: string) => {
    setMessage(text);
    setAdding(false);
    setEditing(null);
  };

  const handleDeleted = (text: string) => {
    setMessage(text);
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Navigation items</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Published, active items appear in the public header. Nest an item
            under a parent to create a dropdown.
          </p>
        </div>
        <button
          className={primaryButton}
          onClick={() => setAdding(true)}
          type="button"
        >
          <Plus aria-hidden className="size-4" />
          Add item
        </button>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm font-semibold text-secondary-800"
        >
          {message}
        </p>
      ) : null}

      {tree.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-sm text-gray-500">
          No menu items yet. The public header shows the default navigation
          until you add and publish items here.
        </p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="hidden border-b border-gray-200 px-3 py-2 text-[11px] font-bold tracking-wide text-gray-500 uppercase md:grid md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)_3.5rem_9rem_5rem] md:gap-3">
            <span>Menu item</span>
            <span>Destination</span>
            <span className="text-center">Order</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {rows.map((row) => (
            <MenuRow
              canDelete={canPublish}
              collapsed={collapsed.has(row.node.id)}
              key={row.node.id}
              onDelete={setDeleting}
              onEdit={setEditing}
              onToggle={toggle}
              row={row}
            />
          ))}
        </div>
      )}

      {adding ? (
        <Modal onClose={() => setAdding(false)} title="Add menu item">
          <MenuForm
            canPublish={canPublish}
            onCancel={() => setAdding(false)}
            onSaved={handleSaved}
            parentOptions={optionsFor(null)}
          />
        </Modal>
      ) : null}

      {editing ? (
        <Modal onClose={() => setEditing(null)} title="Edit menu item">
          <MenuForm
            canPublish={canPublish}
            item={editing}
            onCancel={() => setEditing(null)}
            onSaved={handleSaved}
            parentOptions={optionsFor(editing.id)}
          />
        </Modal>
      ) : null}

      {deleting ? (
        <DeleteDialog
          item={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={handleDeleted}
        />
      ) : null}
    </div>
  );
}
