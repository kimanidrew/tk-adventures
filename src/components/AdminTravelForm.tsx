"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Media = {
  type: "IMAGE" | "VIDEO";
  url: string;
  key: string;
  alt: string;
};

type Initial = {
  id?: string;
  title?: string;
  destination?: string;
  country?: string | null;
  category?: string;
  duration?: string | null;
  travelDate?: string | Date | null;
  price?: number | null;
  currency?: string;
  excerpt?: string | null;
  description?: string | null;
  featured?: boolean;
  published?: boolean;
  coverImage?: string | null;
  coverKey?: string | null;
  media?: Media[];
};

const categories = [
  "SAFARI", "BEACH", "HIKING", "CITY", "HONEYMOON",
  "FAMILY", "INTERNATIONAL", "OTHER",
] as const;

export function AdminTravelForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [d, setD] = useState<Initial>({
    category: "SAFARI",
    currency: "KES",
    published: true,
    ...initial,
    travelDate: initial?.travelDate
      ? new Date(initial.travelDate).toISOString().slice(0, 10)
      : "",
  });
  const [media, setMedia] = useState<Media[]>(initial?.media || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function ch(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const x = e.target;
    setD((v) => ({
      ...v,
      [x.name]:
        x.type === "checkbox"
          ? (x as HTMLInputElement).checked
          : x.name === "price"
            ? x.value ? Number(x.value) : null
            : x.value,
    }));
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const next = [...media];
      for (const f of Array.from(files)) {
        const r = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: f.name, contentType: f.type }),
        });
        if (!r.ok) throw new Error("Upload authorization failed.");
        const j = await r.json();
        const put = await fetch(j.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": f.type },
          body: f,
        });
        if (!put.ok) throw new Error("File upload failed.");
        next.push({
          type: f.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          url: j.publicUrl,
          key: j.key,
          alt: f.name,
        });
      }
      setMedia(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "One or more files could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        ...d,
        travelDate: d.travelDate ? new Date(String(d.travelDate)).toISOString() : null,
        media,
        coverImage: d.coverImage || media.find((m) => m.type === "IMAGE")?.url || null,
        coverKey: d.coverKey || media.find((m) => m.type === "IMAGE")?.key || null,
      };
      const r = await fetch(
        d.id ? "/api/admin/travels/" + d.id : "/api/admin/travels",
        {
          method: d.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "Could not save");
        setBusy(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not save the trip. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form className="form admin-form" onSubmit={save}>
      <div className="form-intro">
        <span className="eyebrow" style={{ color: "#59752a" }}>Journey setup</span>
        <h2>{d.id ? "Edit this journey" : "Create a new journey"}</h2>
        <p>Add the trip date and it will automatically appear in the public Upcoming Trips section while the date is still ahead.</p>
      </div>

      <div className="form-row">
        <input name="title" value={d.title || ""} onChange={ch} placeholder="Trip title" required />
        <input name="destination" value={d.destination || ""} onChange={ch} placeholder="Destination" required />
      </div>

      <div className="form-row">
        <input name="country" value={d.country || ""} onChange={ch} placeholder="Country" />
        <select name="category" value={d.category || "OTHER"} onChange={ch}>
          {categories.map((category) => (
            <option key={category} value={category}>{category.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="form-row three">
        <div className="field"><label htmlFor="travelDate">Departure / trip date</label><input id="travelDate" name="travelDate" type="date" value={typeof d.travelDate === "string" ? d.travelDate : ""} onChange={ch} /><small>This date controls whether the trip is shown as upcoming.</small></div>
        <div className="field"><label htmlFor="duration">Duration</label><input id="duration" name="duration" value={d.duration || ""} onChange={ch} placeholder="4 Days" /></div>
        <div className="field"><label htmlFor="price">Price / person</label><input id="price" name="price" type="number" value={d.price ?? ""} onChange={ch} placeholder="Price" /></div>
      </div>

      <input name="currency" value={d.currency || "KES"} onChange={ch} placeholder="Currency" />
      <input name="excerpt" value={d.excerpt || ""} onChange={ch} placeholder="Short description" />
      <textarea name="description" value={d.description || ""} onChange={ch} placeholder="Full trip description" />

      <label className="btn upload-btn">
        Upload trip images / videos
        <input type="file" hidden multiple accept="image/*,video/*" onChange={upload} />
      </label>

      {busy && <small>Uploading or saving…</small>}

      <div className="media-list">
        {media.map((m, i) => (
          <div className="media-item" key={m.key + i}>
            {m.type === "VIDEO" ? <video src={m.url} controls /> : <img src={m.url} alt={m.alt} />}
            <small>{m.type} <button type="button" onClick={() => setMedia(media.filter((_, j) => j !== i))}>remove</button></small>
          </div>
        ))}
      </div>

      <div className="checks">
        <label><input name="featured" type="checkbox" checked={!!d.featured} onChange={ch} /> Featured</label>
        <label><input name="published" type="checkbox" checked={d.published !== false} onChange={ch} /> Published</label>
      </div>

      {error && <p className="form-error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save journey"}</button>
    </form>
  );
}
