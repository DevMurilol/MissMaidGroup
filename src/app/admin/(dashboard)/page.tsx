import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-session";

export default async function AdminIndexPage() {
  await requireAdminPage();
  redirect("/admin/leads");
}
