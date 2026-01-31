import Sidebar, { DRAWER_WIDTH } from "@/components/ui/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex">
        <Sidebar />
        <main
          className="min-h-screen flex-1 bg-gray-50 p-6"
          style={{ marginLeft: DRAWER_WIDTH }}
        >
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
