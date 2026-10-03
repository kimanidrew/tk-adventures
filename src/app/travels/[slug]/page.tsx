import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";

export const dynamic = "force-dynamic";

export default async function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const t = await prisma.travel.findUnique({
    where: { slug },
    include: {
      media: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!t || !t.published) {
    return notFound();
  }

  const fallback =
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85";

  return (
    <main>
      <section className="detail">
        <div className="container">
          <div className="detailgrid">
            <div className="detailmedia">
              <img src={t.coverImage || fallback} alt={t.title} />
            </div>

            <div className="detailpanel">
              <span className="pill">{t.category.replace("_", " ")}</span>
              <h1>{t.title}</h1>

              <div className="meta">
                {t.destination}
                {t.country ? " · " + t.country : ""}
                {t.duration ? " · " + t.duration : ""}
              </div>

              {t.price && (
                <div className="price">
                  {t.currency} {t.price.toLocaleString()}{" "}
                  <span className="meta">/ person</span>
                </div>
              )}

              <p>{t.description || t.excerpt}</p>

              <Link
                className="btn"
                href={"/contact?travel=" + encodeURIComponent(t.title)}
              >
                Ask about this trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {t.media.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="head">
              <h2>Trip moments</h2>
              <p>Photos and videos from the adventure.</p>
            </div>

            <div className="grid">
              {t.media.map((m) => (
                <div className="card" key={m.id}>
                  <div className="media">
                    {m.type === "VIDEO" ? (
                      <video src={m.url} controls />
                    ) : (
                      <img src={m.url} alt={m.alt || t.title} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container contact">
          <div className="head">
            <div>
              <div className="eyebrow" style={{ color: "#567021" }}>
                Make it yours
              </div>
              <h2>Ask us about this trip</h2>
            </div>
          </div>

          <InquiryForm travel={t.title} />
        </div>
      </section>
    </main>
  );
}
