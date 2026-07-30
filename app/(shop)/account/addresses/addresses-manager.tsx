"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Address,
  type AddressInput,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/app/lib/services/address";
import { Icon } from "@/app/ui/nova/nova-icons";

const EMPTY_FORM: AddressInput = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

export default function AddressesManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setError(null);
  };

  const startEdit = (a: Address) => {
    setForm({
      fullName: a.fullName,
      phone: a.phone,
      line1: a.line1,
      line2: a.line2 ?? "",
      city: a.city,
      state: a.state ?? "",
      postalCode: a.postalCode,
      country: a.country,
      isDefault: a.isDefault,
    });
    setEditingId(a.id);
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setError(null);
  };

  const set = (key: keyof AddressInput, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    for (const [key, label] of [
      ["fullName", "Full name"],
      ["phone", "Phone"],
      ["line1", "Address line 1"],
      ["city", "City"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
    ] as const) {
      if (!String(form[key] ?? "").trim()) {
        setError(`${label} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const res =
        editingId === "new"
          ? await createAddress(form)
          : await updateAddress(editingId as number, form);
      if (res.error) {
        setError(res.error);
        return;
      }
      setEditingId(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    setLoading(true);
    try {
      const res = await deleteAddress(id);
      if (res.error) setError(res.error);
      else router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    setLoading(true);
    try {
      const res = await setDefaultAddress(id);
      if (res.error) setError(res.error);
      else router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--r-sm)", background: "#ffe9e7", color: "var(--sale)", fontSize: 14, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {initialAddresses.length === 0 && editingId === null && (
        <p className="muted" style={{ fontSize: 14 }}>
          You have no saved addresses yet. Add one to speed up checkout.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {initialAddresses.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                {a.fullName}
                {a.isDefault && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--good)", border: "1px solid var(--good)", borderRadius: 999, padding: "1px 8px" }}>
                    Default
                  </span>
                )}
              </div>
              <div className="muted">{a.phone}</div>
              <div>
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
              </div>
              <div>
                {[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}
              </div>
              <div>{a.country}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              {!a.isDefault && (
                <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => handleSetDefault(a.id)} disabled={loading}>
                  Set default
                </button>
              )}
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => startEdit(a)} disabled={loading}>
                <Icon name="edit" size={14} /> Edit
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 12, color: "var(--sale)" }} onClick={() => handleDelete(a.id)} disabled={loading}>
                <Icon name="trash" size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId === null ? (
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={startCreate}>
          <Icon name="plus" size={16} /> Add new address
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700 }}>
            {editingId === "new" ? "New address" : "Edit address"}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Full name</label>
              <input className="input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Address line 1</label>
            <input className="input" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
          </div>
          <div className="field">
            <label>Address line 2 (optional)</label>
            <input className="input" value={form.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>City</label>
              <input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="field">
              <label>State / District (optional)</label>
              <input className="input" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} />
            </div>
            <div className="field">
              <label>Postal code</label>
              <input className="input" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Country</label>
            <input className="input" value={form.country} onChange={(e) => set("country", e.target.value)} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.isDefault ?? false} onChange={(e) => set("isDefault", e.target.checked)} />
            Set as default address
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save address"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
