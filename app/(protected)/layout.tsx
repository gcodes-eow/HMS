// app/(protected)/layout.tsx
import SidebarWrapper from "@/components/SidebarWrapper";
import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 hidden lg:block border-r bg-white">
        <SidebarWrapper />
      </aside>

      {/* Main section with navbar + content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
