// components/SidebarWrapper.tsx
import { Sidebar } from "./Sidebar";
import { getRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";

export default async function SidebarWrapper() {
  const role = await getRole();
  const { userId } = await auth();

  return (
    <Sidebar
      role={role?.toLowerCase() ?? "patient"}
      userId={userId ?? ""}
    />
  );
}
