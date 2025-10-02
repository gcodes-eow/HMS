// utils/services/staff.ts
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

// ✅ import runtime enums from central types
import { Role, Status } from "@/types/dataTypes";

// ✅ local Staff interface aligned with central enums
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;        // enforce Role enum
  status: Status;    // enforce Status enum
  img?: string | null;
  color_code?: string | null;
  created_at?: Date | string;
}

export interface TableStaff extends Staff {
  index: number;
  phone: string;
  img: string;
  color_code: string;
  created_at: Date;
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
 * - Ensures index, phone, img, color_code, and created_at exist
 */
export function normalizeStaffData(staff: Staff[]): TableStaff[] {
  return staff.map((s, index) => ({
    ...s,
    index,
    phone: s.phone ?? "",
    img: s.img ?? "",
    color_code: s.color_code ?? "#ccc",
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
      data: normalizeStaffData(staff as Staff[]), // cast Prisma result
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
