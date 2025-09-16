// utils/services/staff.ts
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export type StaffStatus = "ACTIVE" | "INACTIVE" | "DORMANT";

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: StaffStatus;
  img?: string | null;
  colorCode?: string | null;
  created_at?: Date | string; // could come from DB as string
}

export interface TableStaff extends Staff {
  index: number;
  phone: string;
  img: string;
  colorCode: string;
  created_at: Date; // required for table display
}

export interface ServiceResponse<T> {
  success: boolean;
  error?: boolean;
  status: number;
  message?: string;
  data?: T;
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
}

interface GetAllStaffProps {
  page: number | string;
  limit?: number | string;
  search?: string;
}

/**
 * Normalize staff data for table display:
 * - Ensures index, phone, img, colorCode, and created_at exist
 */
export function normalizeStaffData(staff: Staff[]): TableStaff[] {
  return staff.map((s, index) => ({
    ...s,
    index,
    phone: s.phone ?? "",
    img: s.img ?? "",
    colorCode: s.colorCode ?? "#ccc",
    created_at: s.created_at ? new Date(s.created_at) : new Date(),
  }));
}

/**
 * Fetch all staff with pagination and optional search
 */
export async function getAllStaff({
  page,
  limit,
  search,
}: GetAllStaffProps): Promise<ServiceResponse<TableStaff[]>> {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const whereClause: Prisma.StaffWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [staff, totalRecords] = await Promise.all([
      db.staff.findMany({
        where: whereClause,
        skip: SKIP,
        take: LIMIT,
        orderBy: { name: "asc" },
      }),
      db.staff.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      success: true,
      error: false,
      data: normalizeStaffData(staff), // fully typed and safe
      totalRecords,
      totalPages,
      currentPage: PAGE_NUMBER,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: true,
      message: "Internal Server Error",
      status: 500,
    };
  }
}
