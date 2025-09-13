// utils/roles.ts
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: string): Promise<boolean> => {
  const { sessionClaims } = await auth();

  const rawRole = sessionClaims?.metadata?.role?.toLowerCase();

  return rawRole === role.toLowerCase();
};

export const getRole = async (): Promise<string> => {
  const { sessionClaims } = await auth();
  const validRoles = [
    "admin",
    "doctor",
    "nurse",
    "patient",
    "cashier",
    "pharmacist",
    "receptionist",
    "laboratory",
  ];

  const rawRole = sessionClaims?.metadata?.role?.toLowerCase();

  if (typeof rawRole === "string" && validRoles.includes(rawRole)) {
    return rawRole;
  }

  return "patient";
};