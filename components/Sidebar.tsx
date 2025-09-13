"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  List,
  ListOrdered,
  Logs,
  LucideIcon,
  Pill,
  Receipt,
  Settings,
  SquareActivity,
  User,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const ACCESS_LEVELS_ALL = [
  "admin",
  "doctor",
  "nurse",
  "laboratory",
  "patient",
  "cashier",
  "receptionist",
  "pharmacist",
];

const SidebarIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
  <Icon className="size-6 lg:size-5" />
);

interface SidebarProps {
  role: string;
  userId: string;
}

export const Sidebar = ({ role, userId }: SidebarProps) => {
  const pathname = usePathname();

  const SIDEBAR_LINKS = [
    {
      label: "MENU",
      links: [
        { name: "Dashboard", href: "/", access: ACCESS_LEVELS_ALL, icon: LayoutDashboard },
        { name: "Profile", href: "/patient/self", access: ["patient"], icon: User },
      ],
    },
    {
      label: "Manage",
      links: [
        { name: "Users", href: "/record/users", access: ["admin"], icon: Users },
        { name: "Doctors", href: "/record/doctors", access: ["admin", "doctor"], icon: User },
        { name: "Staffs", href: "/record/staffs", access: ["admin", "doctor"], icon: UserRound },
        { name: "Patients", href: "/record/patients", access: ["admin", "doctor", "nurse", "receptionist"], icon: UsersRound },
        { name: "Appointments", href: "/record/appointments", access: ["admin", "doctor", "nurse", "receptionist"], icon: ListOrdered },
        ...(role === "patient"
          ? [
              {
                name: "My Appointments",
                href: `/record/appointments?id=${userId}&p=1`,
                access: ["patient"],
                icon: ListOrdered,
              },
            ]
          : []),
        { name: "Services", href: "/record/services", access: ["admin", "nurse", "doctor", "receptionist", "pharmacist"], icon: SquareActivity },
        { name: "Medical Records", href: "/record/medical-records", access: ["admin", "doctor", "nurse", "laboratory"], icon: SquareActivity },
        { name: "Laboratory", href: "/laboratory", access: ["admin", "doctor", "nurse", "laboratory"], icon: SquareActivity },
        { name: "Billing Overview", href: "/record/billing", access: ["admin", "doctor", "cashier", "receptionist"], icon: Receipt },
        { name: "Inventory", href: "/record/inventory", access: ["admin", "pharmacist", "cashier"], icon: Pill },
        { name: "Patient Management", href: "/nurse/patient-management", access: ["nurse"], icon: Users },
        { name: "Administer Medications", href: "/nurse/administer-medications", access: ["admin", "doctor", "nurse", "pharmacist"], icon: Pill },
        { name: "Records", href: "/patient/self", access: ["patient"], icon: List },
        { name: "Prescription", href: "#", access: ["patient", "pharmacist"], icon: Pill },
        { name: "Billing", href: "/patient/self?cat=payments", access: ["patient", "cashier", "receptionist"], icon: Receipt },
      ],
    },
    {
      label: "System",
      links: [
        { name: "Notifications", href: "/notifications", access: ACCESS_LEVELS_ALL, icon: Bell },
        { name: "Audit Logs", href: "/admin/audit-logs", access: ["admin"], icon: Logs },
        { name: "Settings", href: "/admin/system-settings", access: ["admin"], icon: Settings },
      ],
    },
  ];

  const isActiveLink = (href: string) => {
    const basePath = href.split("?")[0];

    if (role === "patient" && href.includes("?id=")) {
      const idParam = new URLSearchParams(pathname.split("?")[1] || "").get("id");
      return idParam === userId;
    }

    if (basePath === "/record/appointments" && pathname.startsWith("/record/appointments")) {
      return role !== "patient" && !href.includes("?id=");
    }

    return pathname.split("?")[0] === basePath;
  };

  return (
    <div className="w-full p-4 flex flex-col justify-between gap-4 bg-white overflow-y-scroll min-h-full">
      <div>
        {/* Logo / Branding */}
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <div className="p-1.5 rounded-md bg-blue-600 text-white">
            <SquareActivity size={22} />
          </div>
          <Link href={"/"} className="hidden lg:flex text-base 2xl:text-xl font-bold">
            ClincX
          </Link>
        </div>

        {/* Links */}
        <div className="mt-4 text-sm">
          {SIDEBAR_LINKS.map((section) => (
            <div key={section.label} className="flex flex-col gap-2">
              <span className="hidden uppercase lg:block text-gray-400 font-bold my-4">
                {section.label}
              </span>
              {section.links.map((link) =>
                link.access.includes(role) ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-center lg:justify-start gap-4 py-2 px-2 rounded-md ${
                      isActiveLink(link.href)
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-blue-600/10"
                    }`}
                  >
                    <SidebarIcon icon={link.icon} />
                    <span className="hidden lg:block">{link.name}</span>
                  </Link>
                ) : null
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <LogoutButton />
    </div>
  );
};
