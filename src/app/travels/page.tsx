import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TravelCard } from "@/components/TravelCard";

export const dynamic = "force-dynamic";

const categories = [
  "SAFARI",
  "BEACH",
  "HIKING",
  "CITY",
  "HONEYMOON",
  "FAMILY",
  "INTERNATIONAL",
] as const;

export default async function Travels({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = categories.includes(
    params.category as (typeof categories)[number],
  )
    ? (params.category as (typeof categories)[number])
    : undefined;

  const travels = await prisma.travel.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main>
      <section className="pagehero">
        <div className="container">
          <div className="eyebrow">Journeys & escapes</div>
          <h1>
            Choose your next
            <br />
            great story.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filters">
            <Link
              className={"filter " + (!category ? "active" : "")}
              href="/travels"
            >
              All
            </Link>

            {categories.map((item) => (
              <Link
                key={item}
                className={"filter " + (category === item ? "active" : "")}
                href={"/travels?category=" + item}
              >
                {item.replace("_", " ")}
              </Link>
            ))}
          </div>

          {travels.length ? (
            <div className="grid">
              {travels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
              ))}
            </div>
          ) : (
            <div className="empty">No journeys match this filter yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
