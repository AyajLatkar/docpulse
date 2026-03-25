import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "PATIENT") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        role="PATIENT"
        userName={session.user?.name || "Patient"}
        userEmail={session.user?.email || ""}
      />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
