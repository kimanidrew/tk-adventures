import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminTravelForm } from "@/components/AdminTravelForm";

export const dynamic = "force-dynamic";

export default async function Edit({ params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) redirect("/admin/login");

  const { id } = await params;
  const t = await prisma.travel.findUnique({
    where: { id },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });

  if (!t) notFound();

  return (
    <main className="admin">
      <div className="container">
        <h1 style={{ font: "800 44px Manrope" }}>Edit trip</h1>
        <div className="contact">
          <AdminTravelForm
            initial={{
              ...t,
              media: t.media.map((m) => ({
                type: m.type,
                url: m.url,
                key: m.key || "",
                alt: m.alt || "",
              })),
            }}
          />
        </div>
      </div>
    </main>
  );
}