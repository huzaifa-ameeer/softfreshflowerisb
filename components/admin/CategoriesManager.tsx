"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { showToast } from "@/components/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Spinner } from "@/components/admin/Loader";
import { adminFetch, errorMessage } from "@/lib/admin-client";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  tone: string;
};

type Draft = {
  name: string;
  icon: string;
  tone: string;
  description: string;
};

const TONES = [
  "rose",
  "orange",
  "amber",
  "yellow",
  "emerald",
  "teal",
  "sky",
  "violet",
  "fuchsia",
];

const emptyDraft: Draft = { name: "", icon: "", tone: "rose", description: "" };

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const labelClass =
  "flex flex-col gap-1.5 text-sm font-medium text-neutral-700";

const primaryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60";

const ghostButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const refresh = useCallback(async () => {
    const result = await adminFetch<{ categories: Category[] }>(
      "/api/admin/categories",
    );

    if (result.ok) {
      setCategories(result.data.categories ?? []);
      setError(null);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const result = await adminFetch<{ categories: Category[] }>(
        "/api/admin/categories",
      );

      if (result.ok) {
        setCategories(result.data.categories ?? []);
        setError(null);
      } else {
        setError(errorMessage(result));
      }

      setLoading(false);
    })();
  }, []);

  function startCreate() {
    setEditing("new");
    setDraft(emptyDraft);
  }

  function startEdit(category: Category) {
    setEditing(category.id);
    setDraft({
      name: category.name,
      icon: category.icon,
      tone: category.tone,
      description: category.description,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);

    const body = JSON.stringify(draft);
    const headers = { "Content-Type": "application/json" };

    const result =
      editing === "new"
        ? await adminFetch("/api/admin/categories", {
            method: "POST",
            headers,
            body,
          })
        : await adminFetch(`/api/admin/categories/${editing}`, {
            method: "PATCH",
            headers,
            body,
          });

    setSaving(false);

    if (!result.ok) {
      showToast(errorMessage(result), "info");
      return;
    }

    showToast(editing === "new" ? "Category created" : "Category updated");
    setEditing(null);
    setDraft(emptyDraft);
    await refresh();
  }

  async function handleDelete() {
    if (!pendingDelete) return;

    setDeleting(pendingDelete.id);

    const result = await adminFetch(`/api/admin/categories/${pendingDelete.id}`, {
      method: "DELETE",
    });

    setDeleting(null);

    if (!result.ok) {
      showToast(errorMessage(result), "info");
      return;
    }

    showToast("Category deleted", "info");
    setPendingDelete(null);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Categories
          </h1>
          <p className="text-sm text-neutral-500">
            {categories.length} categories
          </p>
        </div>

        <button type="button" onClick={startCreate} className={primaryButton}>
          New category
        </button>
      </header>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-neutral-200"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Name
              <input
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Icon (emoji)
              <input
                value={draft.icon}
                onChange={(event) =>
                  setDraft({ ...draft, icon: event.target.value })
                }
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Tone
              <select
                value={draft.tone}
                onChange={(event) =>
                  setDraft({ ...draft, tone: event.target.value })
                }
                className={inputClass}
              >
                {TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Description
              <input
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving && <Spinner className="size-4" />}
              {editing === "new" ? "Create" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setDraft(emptyDraft);
              }}
              className={ghostButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner className="size-6" />
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-neutral-500">No categories yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-lg">
                {category.icon || "•"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {category.name}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  /{category.slug} · {category.tone}
                </p>
              </div>

              <div className="flex gap-2">
                {editing !== category.id && (
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className={ghostButton}
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(category)}
                  disabled={deleting === category.id}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting === category.id && <Spinner className="size-4" />}
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete category"
        message={
          pendingDelete
            ? `Delete “${pendingDelete.name}”? This cannot be undone.`
            : ""
        }
        busy={deleting !== null}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
