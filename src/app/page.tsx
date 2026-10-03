import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TravelCard } from "@/components/TravelCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const now = new Date();
  const [featured, upcoming] = await Promise.all([
    prisma.travel.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.travel.findMany({
      where: { published: true, travelDate: { gte: now } },
      orderBy: { travelDate: "asc" },
      take: 6,
    }),
  ]);

  return (
    <main>
      <section className="hero">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="container hero-content">
          <div className="hero-kicker"><span /> Kenya · Africa · Worldwide</div>
          <h1>Go somewhere<br /><span>you'll remember.</span></h1>
          <p>Curated safaris, beach escapes, city breaks and unforgettable journeys — made to feel as extraordinary as the place itself.</p>
          <div className="actions">
            <Link className="btn" href="/travels">Explore journeys <span>↗</span></Link>
            <Link className="btn dark" href="/contact">Create your trip</Link>
          </div>
          <div className="hero-trust"><span>✦ Thoughtfully curated</span><span>✦ Personal planning</span><span>✦ Kenya based</span></div>
        </div>
        <div className="scroll-note">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="section intro-section">
        <div className="container intro-grid">
          <div><div className="eyebrow dark-eyebrow">Travel, but make it yours.</div><h2>Not just places.<br /><em>Stories waiting to happen.</em></h2></div>
          <div><p className="lead">From a sunrise across the Mara to an ocean sunset in Zanzibar, we design journeys around the moments you will talk about long after you return home.</p><Link className="text-link" href="/travels">Discover all journeys <span>→</span></Link></div>
        </div>
      </section>

      {upcoming.length > 0 && <section className="section upcoming-section">
        <div className="container">
          <div className="section-label-row">
            <div><div className="eyebrow dark-eyebrow">Mark your calendar</div><h2>Upcoming journeys.</h2></div>
            <p>Every published trip with a future date is automatically collected here. Add a date from the admin panel and it appears without any extra setup.</p>
          </div>
          <div className="grid">{upcoming.map((travel) => <TravelCard key={travel.id} travel={travel} />)}</div>
        </div>
      </section>}

      <section className="section featured-section">
        <div className="container">
          <div className="section-label-row">
            <div><div className="eyebrow dark-eyebrow">Our collection</div><h2>Journeys worth taking.</h2></div>
            <p>Explore handpicked adventures across Kenya and beyond, then tell us how you want yours to feel.</p>
          </div>
          {featured.length ? <div className="grid">{featured.map((t) => <TravelCard key={t.id} travel={t} />)}</div> : <div className="empty">New journeys are on the way.</div>}
        </div>
      </section>

      <section className="section manifesto-section" id="experience">
        <div className="container"><div className="manifesto">
          <div className="manifesto-top"><span>01 — THE TRIPPLE TEE WAY</span><span>KENYA / WORLDWIDE</span></div>
          <div className="manifesto-main">
            <div><h2>Go curious.<br /><em>Come back changed.</em></h2><p>Travel should feel exciting before you even leave. We take care of the details, shape the experience around you and leave room for the unexpected.</p><Link className="btn" href="/contact">Let's plan something <span>↗</span></Link></div>
            <div className="manifesto-side"><div><b>01</b><span>Discover</span><p>Find places that spark something.</p></div><div><b>02</b><span>Experience</span><p>Make room for the moments.</p></div><div><b>03</b><span>Remember</span><p>Bring the story home with you.</p></div></div>
          </div>
        </div></div>
      </section>

      <section className="section instagram-section">
        <div className="container instagram-banner"><div><div className="eyebrow">FOLLOW THE JOURNEY</div><h2>The next adventure<br /><em>might be yours.</em></h2></div><a href="https://www.instagram.com/tripple_tee_travellers/" target="_blank" rel="noreferrer" className="btn">Follow @tripple_tee_travellers ↗</a></div>
      </section>
    </main>
  );
}
