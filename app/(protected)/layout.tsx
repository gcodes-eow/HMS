// app/(protected)/layout.tsx
import SidebarWrapper from "@/components/SidebarWrapper";
import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 hidden lg:block border-r bg-card text-card-foreground">
        <SidebarWrapper />
      </aside>

      {/* Main section with navbar + content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}

