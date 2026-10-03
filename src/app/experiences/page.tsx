import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fallback =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85";

export default async function ExperiencesPage() {
  const [pastTrips, experiences] = await Promise.all([
    prisma.travel.findMany({
      where: { published: true, isPast: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.experience.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { date: "desc" }],
    }),
  ]);

  return (
    <main>
      <section className="pagehero">
        <div className="container">
          <div className="eyebrow">The journey continues</div>
          <h1>
            Past trips.
            <br />
            Real memories.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <div className="eyebrow" style={{ color: "#567021" }}>
                Where we have been
              </div>
              <h2>Trips we have shared.</h2>
            </div>
            <p>
              Take a look back at some of the journeys we have created. Every
              trip is a collection of places, people and moments worth
              remembering.
            </p>
          </div>

          {pastTrips.length ? (
            <div className="grid">
              {pastTrips.map((trip) => (
                <article className="card" key={trip.id}>
                  <Link href={"/travels/" + trip.slug}>
                    <div className="media">
                      <img
                        src={trip.coverImage || fallback}
                        alt={trip.title}
                      />
                    </div>
                    <div className="body">
                      <span className="pill">
                        {trip.category.replace("_", " ")}
                      </span>
                      <h3>{trip.title}</h3>
                      <div className="meta">
                        {trip.destination}
                        {trip.country ? " · " + trip.country : ""}
                      </div>
                      {trip.excerpt && <p className="cardcopy">{trip.excerpt}</p>}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">Past trips will appear here.</div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="head">
            <div>
              <div className="eyebrow" style={{ color: "#567021" }}>
                From the road
              </div>
              <h2>Experiences & moments.</h2>
            </div>
            <p>
              A glimpse into the little moments that make a Tripple Tee journey
              memorable long after the bags are unpacked.
            </p>
          </div>

          {experiences.length ? (
            <div className="grid">
              {experiences.map((experience) => (
                <article className="card" key={experience.id}>
                  <div className="media">
                    <img
                      src={experience.image || fallback}
                      alt={experience.title}
                    />
                  </div>
                  <div className="body">
                    <span className="pill">
                      {experience.destination || "Tripple Tee experience"}
                    </span>
                    <h3>{experience.title}</h3>
                    <div className="meta">
                      {experience.date
                        ? experience.date.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Past experience"}
                    </div>
                    {experience.excerpt && (
                      <p className="cardcopy">{experience.excerpt}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">Experiences will appear here.</div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="story">
            <div className="storygrid">
              <div>
                <div className="eyebrow">Your turn</div>
                <h2>Ready to create your own story?</h2>
                <p>
                  Tell us where you would love to go and we will help turn the
                  idea into a journey you will remember.
                </p>
                <Link className="btn" href="/contact">
                  Plan my trip
                </Link>
              </div>
              <div className="stats">
                <div className="stat">
                  <strong>Past</strong>
                  <span>journeys</span>
                </div>
                <div className="stat">
                  <strong>Real</strong>
                  <span>experiences</span>
                </div>
                <div className="stat">
                  <strong>Next</strong>
                  <span>your story</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
