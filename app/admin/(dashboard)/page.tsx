import { redirect } from "next/navigation";

/** /admin has no content of its own — land on Disponibilidad by default. */
export default function AdminHomePage() {
  redirect("/admin/availability");
}
