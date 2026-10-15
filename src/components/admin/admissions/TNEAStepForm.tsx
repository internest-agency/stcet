"use client";

import { useActionState, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import { saveTNEAStep } from "@/src/app/admin/(protected)/admissions/actions";
import type { TNEAStepFormState } from "@/src/lib/admin/admissions-validation";

export type TNEAStepRecord = {
  id: number;
  stepNumber: number;
  title: string;
  description: string | null;
  instructions: unknown;
  imagePath: string | null;
  imageLabel: string | null;
  sortOrder: number;
  isPublished: boolean;
} | null;

type InstructionRow = { id: string; value: string };

let instructionSequence = 0;
function nextInstructionId() {
  instructionSequence += 1;
  return `tnea-instruction-${instructionSequence}`;
}

function toInstructionList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export default function TNEAStepForm({
  step,
  defaultStepNumber,
  onCancel,
}: {
  step: TNEAStepRecord;
  defaultStepNumber: number;
  onCancel: () => void;
}) {
  const [stepNumber, setStepNumber] = useState(
    String(step?.stepNumber ?? defaultStepNumber),
  );
  const [title, setTitle] = useState(step?.title ?? "");
  const [description, setDescription] = useState(step?.description ?? "");
  const [imagePath, setImagePath] = useState(step?.imagePath ?? "");
  const [imageLabel, setImageLabel] = useState(
    step?.imageLabel ?? "TNEA Application",
  );
  const [sortOrder, setSortOrder] = useState(String(step?.sortOrder ?? 0));
  const [isPublished, setIsPublished] = useState(step?.isPublished ?? true);
  const [instructions, setInstructions] = useState<InstructionRow[]>(() => {
    const existing = toInstructionList(step?.instructions);
    const rows = existing.map((value) => ({
      id: nextInstructionId(),
      value,
    }));
    return rows.length ? rows : [{ id: nextInstructionId(), value: "" }];
  });

  // The action returns a state object on failure (instead of redirecting), so
  // the modal stays open and every controlled value is preserved. It only
  // navigates away on a confirmed successful save.
  const [state, formAction, isPending] = useActionState<
    TNEAStepFormState,
    FormData
  >(saveTNEAStep, { fieldErrors: {} });
  const fieldError = (key: string) => state.fieldErrors?.[key];

  const updateInstruction = (id: string, value: string) =>
    setInstructions((current) =>
      current.map((row) => (row.id === id ? { ...row, value } : row)),
    );
  const addInstruction = () =>
    setInstructions((current) => [
      ...current,
      { id: nextInstructionId(), value: "" },
    ]);
  const removeInstruction = (id: string) =>
    setInstructions((current) => current.filter((row) => row.id !== id));
  const moveInstruction = (index: number, direction: -1 | 1) =>
    setInstructions((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  // Blank rows are dropped so empty instructions are never persisted.
  const preparedInstructions = instructions
    .map((row) => row.value.trim())
    .filter(Boolean);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="id" value={step?.id ?? ""} />
      <input type="hidden" name="imagePath" value={imagePath} />
      <input
        type="hidden"
        name="instructions"
        value={JSON.stringify(preparedInstructions)}
      />

      {state.formError ? (
        <p
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {state.formError}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600">
            Step Number
          </label>
          <input
            type="number"
            name="stepNumber"
            value={stepNumber}
            onChange={(event) => setStepNumber(event.target.value)}
            required
            min={1}
            className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
          />
          {fieldError("stepNumber") ? (
            <p className="mt-1 text-xs font-semibold text-red-700">
              {fieldError("stepNumber")}
            </p>
          ) : null}
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-600">
            Step Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
          />
          {fieldError("title") ? (
            <p className="mt-1 text-xs font-semibold text-red-700">
              {fieldError("title")}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600">
          Short Description
        </label>
        <textarea
          name="description"
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Introductory paragraph shown below the title."
          className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
        />
        {fieldError("description") ? (
          <p className="mt-1 text-xs font-semibold text-red-700">
            {fieldError("description")}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-600">
            Step Instructions
          </label>
          <button
            type="button"
            onClick={addInstruction}
            className="inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
          >
            <Plus className="size-3.5" /> Add instruction
          </button>
        </div>

        {instructions.length === 0 ? (
          <div className="mt-2 rounded border-2 border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
            No instructions yet. Click &quot;Add instruction&quot; to create one.
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {instructions.map((row, index) => (
              <div key={row.id} className="flex items-start gap-2">
                <span className="mt-2 grid size-6 shrink-0 place-items-center rounded-full bg-accent-100 text-xs font-bold text-accent-700">
                  {index + 1}
                </span>
                <textarea
                  rows={2}
                  value={row.value}
                  onChange={(event) =>
                    updateInstruction(row.id, event.target.value)
                  }
                  placeholder="Describe this action..."
                  className="min-h-0 flex-1 rounded border border-gray-300 p-2 text-sm"
                />
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveInstruction(index, -1)}
                    disabled={index === 0}
                    aria-label="Move instruction up"
                    className="rounded border border-gray-300 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveInstruction(index, 1)}
                    disabled={index === instructions.length - 1}
                    aria-label="Move instruction down"
                    className="rounded border border-gray-300 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(row.id)}
                  aria-label="Remove instruction"
                  className="rounded border border-gray-300 p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {fieldError("instructions") ? (
          <p className="mt-1 text-xs font-semibold text-red-700">
            {fieldError("instructions")}
          </p>
        ) : null}
      </div>

      <ImageUploadField
        label="Step Image"
        category="admissions"
        value={imagePath}
        onChange={setImagePath}
        error={fieldError("imagePath")}
      />

      <div>
        <label className="block text-xs font-bold text-gray-600">
          Image Label
        </label>
        <input
          type="text"
          name="imageLabel"
          value={imageLabel}
          onChange={(event) => setImageLabel(event.target.value)}
          className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
        />
        {fieldError("imageLabel") ? (
          <p className="mt-1 text-xs font-semibold text-red-700">
            {fieldError("imageLabel")}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-gray-600">
            Sort Order
          </label>
          <input
            type="number"
            name="sortOrder"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="mt-1 w-24 rounded border border-gray-300 p-2 text-sm"
          />
          {fieldError("sortOrder") ? (
            <p className="mt-1 text-xs font-semibold text-red-700">
              {fieldError("sortOrder")}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="tneaPub"
            name="isPublished"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="size-4"
          />
          <label htmlFor="tneaPub" className="text-sm font-semibold">
            Published
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="size-4" /> Save Step
            </>
          )}
        </button>
      </div>
    </form>
  );
}
