import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminTravelForm } from "@/components/AdminTravelForm";

export default async function New() {
  if (!await isAdmin()) redirect("/admin/login");

  return (
    <main className="admin">
      <div className="container">
        <h1 style={{ font: "800 44px Manrope" }}>Add a trip</h1>
        <div className="contact">
          <AdminTravelForm />
        </div>
      </div>
    </main>
  );
}