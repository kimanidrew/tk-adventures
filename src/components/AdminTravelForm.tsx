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
  country?: string;
  category?: string;
  duration?: string;
  price?: number | null;
  currency?: string;
  excerpt?: string;
  description?: string;
  featured?: boolean;
  published?: boolean;
  coverImage?: string | null;
  coverKey?: string | null;
  media?: Media[];
};

const categories = [
  "SAFARI",
  "BEACH",
  "HIKING",
  "CITY",
  "HONEYMOON",
  "FAMILY",
  "INTERNATIONAL",
  "OTHER",
] as const;

export function AdminTravelForm({ initial }: { initial?: Initial }) {
  const router = useRouter();

  const [d, setD] = useState<Initial>({
    category: "SAFARI",
    currency: "KES",
    published: true,
    ...initial,
  });
  const [media, setMedia] = useState<Media[]>(initial?.media || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function ch(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const x = e.target;

    setD((v) => ({
      ...v,
      [x.name]:
        x.type === "checkbox"
          ? (x as HTMLInputElement).checked
          : x.name === "price"
            ? x.value
              ? Number(x.value)
              : null
            : x.value,
    }));
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files?.length) return;

    setBusy(true);

    try {
      const next = [...media];

      for (const f of Array.from(files)) {
        const r = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: f.name,
            contentType: f.type,
          }),
        });

        if (!r.ok) {
          continue;
        }

        const j = await r.json();

        const put = await fetch(j.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": f.type,
          },
          body: f,
        });

        if (put.ok) {
          next.push({
            type: f.type.startsWith("video/") ? "VIDEO" : "IMAGE",
            url: j.publicUrl,
            key: j.key,
            alt: f.name,
          });
        }
      }

      setMedia(next);
    } catch {
      setError("One or more files could not be uploaded.");
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
        media,
        coverImage:
          d.coverImage || media.find((m) => m.type === "IMAGE")?.url || null,
        coverKey:
          d.coverKey || media.find((m) => m.type === "IMAGE")?.key || null,
      };

      const r = await fetch(
        d.id ? "/api/admin/travels/" + d.id : "/api/admin/travels",
        {
          method: d.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
    <form className="form" onSubmit={save}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <input
          name="title"
          value={d.title || ""}
          onChange={ch}
          placeholder="Trip title"
          required
        />
        <input
          name="destination"
          value={d.destination || ""}
          onChange={ch}
          placeholder="Destination"
          required
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <input
          name="country"
          value={d.country || ""}
          onChange={ch}
          placeholder="Country"
        />
        <select name="category" value={d.category || "OTHER"} onChange={ch}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <input
          name="duration"
          value={d.duration || ""}
          onChange={ch}
          placeholder="Duration"
        />
        <input
          name="price"
          type="number"
          value={d.price ?? ""}
          onChange={ch}
          placeholder="Price / person"
        />
        <input
          name="currency"
          value={d.currency || "KES"}
          onChange={ch}
          placeholder="Currency"
        />
      </div>

      <input
        name="excerpt"
        value={d.excerpt || ""}
        onChange={ch}
        placeholder="Short description"
      />

      <textarea
        name="description"
        value={d.description || ""}
        onChange={ch}
        placeholder="Full trip description"
      />

      <label className="btn">
        Upload trip images / videos
        <input
          type="file"
          hidden
          multiple
          accept="image/*,video/*"
          onChange={upload}
        />
      </label>

      {busy && <small>Uploading or saving…</small>}

      <div className="media-list">
        {media.map((m, i) => (
          <div className="media-item" key={m.key + i}>
            {m.type === "VIDEO" ? (
              <video src={m.url} controls />
            ) : (
              <img src={m.url} alt={m.alt} />
            )}

            <small>
              {m.type}{" "}
              <button
                type="button"
                onClick={() =>
                  setMedia(media.filter((_, j) => j !== i))
                }
              >
                remove
              </button>
            </small>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        <label>
          <input
            name="featured"
            type="checkbox"
            checked={!!d.featured}
            onChange={ch}
          />
          Featured
        </label>

        <label>
          <input
            name="published"
            type="checkbox"
            checked={d.published !== false}
            onChange={ch}
          />
          Published
        </label>
      </div>

      {error && <p style={{ color: "#a52d22" }}>{error}</p>}

      <button className="btn" disabled={busy}>
        {busy ? "Saving…" : "Save trip"}
      </button>
    </form>
  );
}
