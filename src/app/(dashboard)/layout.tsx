import Sidebar, { DRAWER_WIDTH } from "@/components/ui/Sidebar";

// Force dynamic rendering for dashboard pages to handle authentication
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main
        className="min-h-screen flex-1 bg-gray-50 p-6"
        style={{ marginLeft: DRAWER_WIDTH }}
      >
        {children}
      </main>
    </div>
  );
}
