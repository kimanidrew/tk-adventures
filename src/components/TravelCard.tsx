import Link from "next/link";
import type { Travel } from "@prisma/client";

export function TravelCard({ travel }: { travel: Travel }) {
  const fallback =
    "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80";
  const upcoming =
    travel.travelDate && new Date(travel.travelDate) >= new Date();

  return (
    <article className="card travel-card">
      <Link href={"/travels/" + travel.slug}>
        <div className="media">
          <img src={travel.coverImage || fallback} alt={travel.title} />
          <div className="media-shade" />
          <div className="card-badges">
            <span className="pill">{travel.category.replace("_", " ")}</span>
            {upcoming && <span className="date-pill">Upcoming</span>}
          </div>
        </div>
        <div className="body">
          <div className="location-line">
            <span>{travel.destination}</span>
            {travel.country && <span>· {travel.country}</span>}
          </div>
          <h3>{travel.title}</h3>
          {travel.excerpt && <p className="cardcopy">{travel.excerpt}</p>}
          <div className="card-bottom">
            <span className="meta">
              {travel.travelDate
                ? new Date(travel.travelDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : travel.duration || "Details coming soon"}
            </span>
            {travel.price != null && (
              <strong className="price">
                {travel.currency} {travel.price.toLocaleString()}
              </strong>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
