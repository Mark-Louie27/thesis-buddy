import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentThesis } from "@/lib/data/theses";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const thesis = await getCurrentThesis();

  if (!thesis) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar thesisTitle={thesis.title} />
      <main className="flex-1 px-10 py-8 max-w-5xl">{children}</main>
    </div>
  );
}
