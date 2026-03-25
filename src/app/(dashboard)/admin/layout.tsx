import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        role="ADMIN"
        userName={session.user?.name || "Admin"}
        userEmail={session.user?.email || ""}
      />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
