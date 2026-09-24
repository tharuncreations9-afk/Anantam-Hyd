"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { EVENT_TYPES } from "@/data/event-types";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatShortDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

const emptyEdit = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  preferredDate: "",
  guests: "",
  message: "",
};

export default function EnquiriesViewer() {
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState(emptyEdit);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  const loadList = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/enquiries?t=${Date.now()}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load.");
      setList(data.enquiries || []);
    } catch (err) {
      setError(err.message || "Failed to load enquiries.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Auto-load on open; refresh when tab/page becomes visible again
  useEffect(() => {
    loadList();

    const refresh = () => {
      if (document.visibilityState === "visible") {
        loadList({ silent: true });
      }
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loadList]);

  const modalOpen = Boolean(detail || editItem || deleteTarget);

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (deleteTarget) setDeleteTarget(null);
      else if (editItem) setEditItem(null);
      else setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, deleteTarget, editItem]);

  const fetchEnquiry = async (id) => {
    const response = await fetch(`/api/enquiries/${id}`, {
      cache: "no-store",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load detail.");
    return data.enquiry;
  };

  const openDetail = async (id) => {
    setActionId(id);
    setError("");
    try {
      setDetail(await fetchEnquiry(id));
      loadList({ silent: true });
    } catch (err) {
      setError(err.message || "Failed to load detail.");
    } finally {
      setActionId("");
    }
  };

  const openEdit = async (id) => {
    setActionId(id);
    setError("");
    setEditError("");
    try {
      const enquiry = await fetchEnquiry(id);
      setEditItem(enquiry);
      setEditValues({
        name: enquiry.name || "",
        phone: enquiry.phone || "",
        email: enquiry.email || "",
        eventType: enquiry.eventType || "",
        preferredDate: enquiry.preferredDate || "",
        guests: enquiry.guests || "",
        message: enquiry.message || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load enquiry.");
    } finally {
      setActionId("");
    }
  };

  const onEditChange = (event) => {
    const { name, value } = event.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editItem) return;
    setSaving(true);
    setEditError("");
    try {
      const response = await fetch(`/api/enquiries/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editValues),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save.");
      setEditItem(null);
      if (detail?.id === data.enquiry.id) setDetail(data.enquiry);
      await loadList({ silent: true });
    } catch (err) {
      setEditError(err.message || "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/enquiries/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete.");
      if (detail?.id === deleteTarget.id) setDetail(null);
      if (editItem?.id === deleteTarget.id) setEditItem(null);
      setDeleteTarget(null);
      await loadList({ silent: true });
    } catch (err) {
      setError(err.message || "Could not delete.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const fieldClass =
    "w-full border-b border-forest-deep/20 bg-transparent py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-muted/60 focus:border-gold";

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm text-muted">
          {loading
            ? "Loading…"
            : `${list.length} enquiry${list.length === 1 ? "" : "ies"}`}
        </p>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden border border-forest-deep/10 bg-cream">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-forest-deep/10 bg-ivory/80">
                <th className="w-[8.5rem] px-3 py-3.5 label-caps text-muted sm:px-4">
                  Actions
                </th>
                <th className="px-3 py-3.5 label-caps text-muted sm:px-4">Name</th>
                <th className="px-3 py-3.5 label-caps text-muted sm:px-4">Event</th>
                <th className="px-3 py-3.5 label-caps text-muted sm:px-4">Phone</th>
                <th className="px-3 py-3.5 label-caps text-muted sm:px-4">Email</th>
                <th className="px-3 py-3.5 label-caps text-muted sm:px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                    Loading enquiries…
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                    No enquiries saved yet.
                  </td>
                </tr>
              ) : (
                list.map((item, index) => {
                  const busy = actionId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-forest-deep/8 transition-colors hover:bg-ivory/70 ${
                        index % 2 === 0 ? "bg-transparent" : "bg-ivory/35"
                      }`}
                    >
                      <td className="px-3 py-3 sm:px-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openDetail(item.id)}
                            disabled={busy}
                            className="flex h-9 w-9 items-center justify-center text-forest-deep/70 transition-colors hover:bg-forest-deep hover:text-ivory disabled:opacity-40"
                            aria-label={`View ${item.name}`}
                            title="View"
                          >
                            <Eye className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(item.id)}
                            disabled={busy}
                            className="flex h-9 w-9 items-center justify-center text-forest-deep/70 transition-colors hover:bg-forest-deep hover:text-ivory disabled:opacity-40"
                            aria-label={`Edit ${item.name}`}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            disabled={busy}
                            className="flex h-9 w-9 items-center justify-center text-forest-deep/70 transition-colors hover:bg-red-800 hover:text-ivory disabled:opacity-40"
                            aria-label={`Delete ${item.name}`}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-serif text-base font-light tracking-wide text-forest-deep sm:px-4">
                        {item.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-charcoal sm:px-4">
                        {item.eventType || "—"}
                      </td>
                      <td className="px-3 py-3 text-sm text-charcoal sm:px-4">
                        {item.phone || "—"}
                      </td>
                      <td className="max-w-[180px] truncate px-3 py-3 text-sm text-muted sm:px-4">
                        {item.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-muted sm:px-4">
                        {formatShortDate(item.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {typeof document !== "undefined" && detail
        ? createPortal(
            <ModalShell
              label="Enquiry details"
              onClose={() => setDetail(null)}
              title={detail.name}
              eyebrow="Enquiry"
            >
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <PopupRow label="Received" value={formatDate(detail.createdAt)} />
                  <PopupRow label="Name" value={detail.name} />
                  <PopupRow label="Phone" value={detail.phone} />
                  <PopupRow label="Email" value={detail.email} />
                  <PopupRow label="Event Type" value={detail.eventType || "—"} />
                  <PopupRow
                    label="Preferred Date"
                    value={detail.preferredDate || "—"}
                  />
                  <PopupRow label="Guests" value={detail.guests || "—"} />
                  <tr className="align-top">
                    <th className="w-[38%] py-2.5 pr-4 label-caps font-normal text-muted">
                      Message
                    </th>
                    <td className="py-2.5 whitespace-pre-wrap leading-relaxed text-charcoal">
                      {detail.message || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </ModalShell>,
            document.body,
          )
        : null}

      {typeof document !== "undefined" && editItem
        ? createPortal(
            <ModalShell
              label="Edit enquiry"
              onClose={() => setEditItem(null)}
              title={editItem.name}
              eyebrow="Edit"
              wide
            >
              <form onSubmit={saveEdit} className="space-y-5">
                {editError ? (
                  <p className="text-sm text-red-700" role="alert">
                    {editError}
                  </p>
                ) : null}
                <div className="grid gap-5 sm:grid-cols-2">
                  <EditField
                    label="Name"
                    name="name"
                    value={editValues.name}
                    onChange={onEditChange}
                    className={fieldClass}
                    required
                  />
                  <EditField
                    label="Phone"
                    name="phone"
                    value={editValues.phone}
                    onChange={onEditChange}
                    className={fieldClass}
                    required
                  />
                  <EditField
                    label="Email"
                    name="email"
                    type="email"
                    value={editValues.email}
                    onChange={onEditChange}
                    className={fieldClass}
                    required
                  />
                  <div>
                    <label htmlFor="edit-eventType" className="label-caps mb-1.5 block">
                      Event Type
                    </label>
                    <select
                      id="edit-eventType"
                      name="eventType"
                      value={editValues.eventType}
                      onChange={onEditChange}
                      className={`${fieldClass} cursor-pointer`}
                    >
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <EditField
                    label="Preferred Date"
                    name="preferredDate"
                    type="date"
                    value={editValues.preferredDate}
                    onChange={onEditChange}
                    className={fieldClass}
                  />
                  <EditField
                    label="Guests"
                    name="guests"
                    value={editValues.guests}
                    onChange={onEditChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="edit-message" className="label-caps mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    id="edit-message"
                    name="message"
                    rows={4}
                    value={editValues.message}
                    onChange={onEditChange}
                    className={`${fieldClass} resize-y`}
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="border border-forest-deep bg-forest-deep px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditItem(null)}
                    className="px-4 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-forest-deep"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </ModalShell>,
            document.body,
          )
        : null}

      {typeof document !== "undefined" && deleteTarget
        ? createPortal(
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-forest-deep/75 p-4 backdrop-blur-[2px]"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              aria-describedby="delete-desc"
            >
              <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Cancel delete"
                onClick={() => setDeleteTarget(null)}
              />
              <div className="relative z-10 w-full max-w-md border border-forest-deep/10 bg-ivory px-6 py-7 shadow-[0_24px_80px_rgba(23,35,29,0.3)] sm:px-8">
                <p className="label-caps text-gold">Confirm</p>
                <h2
                  id="delete-title"
                  className="mt-2 font-serif text-2xl font-light tracking-wide text-forest-deep"
                >
                  Delete this enquiry?
                </h2>
                <p id="delete-desc" className="mt-3 text-sm leading-relaxed text-muted">
                  This will permanently remove the enquiry from{" "}
                  <span className="text-forest-deep">{deleteTarget.name}</span>
                  {deleteTarget.eventType
                    ? ` (${deleteTarget.eventType})`
                    : ""}
                  . This action cannot be undone.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="border border-red-800 bg-red-800 px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-red-900 disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                    className="border border-forest-deep/20 px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-forest-deep transition-colors hover:border-forest-deep disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function ModalShell({ label, onClose, title, eyebrow, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/70 p-4 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full border border-forest-deep/10 bg-ivory shadow-[0_24px_80px_rgba(23,35,29,0.28)] ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-forest-deep/10 px-5 py-4 sm:px-6">
          <div>
            <p className="label-caps text-gold">{eyebrow}</p>
            <h2 className="mt-1 font-serif text-2xl font-light tracking-wide text-forest-deep">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-muted transition-colors hover:text-forest-deep"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="max-h-[min(75vh,640px)] overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function PopupRow({ label, value }) {
  return (
    <tr className="border-b border-forest-deep/8 align-top">
      <th className="w-[38%] py-2.5 pr-4 label-caps font-normal text-muted">
        {label}
      </th>
      <td className="py-2.5 text-charcoal">{value}</td>
    </tr>
  );
}

function EditField({
  label,
  name,
  value,
  onChange,
  className,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label htmlFor={`edit-${name}`} className="label-caps mb-1.5 block">
        {label}
      </label>
      <input
        id={`edit-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        required={required}
      />
    </div>
  );
}
