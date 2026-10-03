import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TravelCard } from "@/components/TravelCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await prisma.travel.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <main>
      <section className="hero">
        <div className="container hero-content">
          <div className="eyebrow">Tripple Tee Travellers · Kenya · Worldwide</div>
          <h1>Travel more. <em>Live the journey.</em></h1>
          <p>
            Tripple Tee Travellers brings you memorable escapes, curated tours,
            safaris, beach holidays and international adventures — planned
            around the way you want to travel.
          </p>
          <div className="actions">
            <Link className="btn" href="/travels">Explore trips</Link>
            <Link className="btn dark" href="/contact">Plan your trip</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <div className="eyebrow" style={{ color: "#567021" }}>
                Featured journeys
              </div>
              <h2>Where will you go next?</h2>
            </div>
            <p>
              Discover destinations and experiences from Kenya to the world, or
              tell us what you have in mind and we will help shape the journey.
            </p>
          </div>

          {featured.length ? (
            <div className="grid">
              {featured.map((t) => (
                <TravelCard key={t.id} travel={t} />
              ))}
            </div>
          ) : (
            <div className="empty">
              Add your first featured trip from the admin area.
            </div>
          )}
        </div>
      </section>

      <section className="section" id="experience">
        <div className="container">
          <div className="story">
            <div className="storygrid">
              <div>
                <div className="eyebrow">The Tripple Tee way</div>
                <h2>More than a destination. Make it a memory.</h2>
                <p>
                  Tripple Tee Travellers is built around discovering new places,
                  sharing great experiences and making travel feel simple from
                  the first idea to the journey home.
                </p>
                <Link className="btn" href="/contact">Talk to our team</Link>
              </div>

              <div className="stats">
                <div className="stat">
                  <strong>Kenya</strong>
                  <span>home base</span>
                </div>
                <div className="stat">
                  <strong>Worldwide</strong>
                  <span>open itinerary</span>
                </div>
                <div className="stat">
                  <strong>1:1</strong>
                  <span>trip planning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="story">
            <div className="eyebrow">Follow the journey</div>
            <h2>See where we are going next.</h2>
            <p style={{ maxWidth: 620, lineHeight: 1.8, color: "#dce7df" }}>
              Follow <strong>@tripple_tee_travellers</strong> on Instagram for
              travel inspiration, destinations, upcoming experiences and
              moments from the road.
            </p>
            <a
              href="https://www.instagram.com/tripple_tee_travellers/"
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Visit Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
