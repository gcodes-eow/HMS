// utils/services/staff.ts
import db from "@/lib/db";

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "DORMANT";
  img?: string;
  colorCode?: string;
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

export async function getAllStaff({
  page,
  limit,
  search,
}: GetAllStaffProps): Promise<ServiceResponse<Staff[]>> {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const whereClause = search
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
      data: staff,
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
