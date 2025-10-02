// utils/services/leave.ts
import prisma from "@/lib/db";
import { LeaveTypeInput, LeaveRequestInput, ApprovalInput } from "@/types/leave";
import { Prisma } from "@prisma/client";

// ==========================
// Leave Types
// ==========================
export async function createLeaveType(data: LeaveTypeInput) {
  return prisma.leaveType.create({ data });
}

export async function getLeaveTypes() {
  return prisma.leaveType.findMany({ orderBy: { name: "asc" } });
}

export async function updateLeaveType(id: number, data: LeaveTypeInput) {
  return prisma.leaveType.update({ where: { id }, data });
}

export async function deleteLeaveType(id: number) {
  return prisma.leaveType.delete({ where: { id } });
}

// ==========================
// Leave Requests
// ==========================
export async function createLeaveRequest(data: LeaveRequestInput) {
  const duration =
    Math.ceil(
      (data.end_date.getTime() - data.start_date.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return prisma.leaveRequest.create({
    data: {
      staff_id: data.staff_id,
      type_id: data.type_id,
      start_date: data.start_date,
      end_date: data.end_date,
      reason: data.reason,
      status: "PENDING",
      duration,
    } as Prisma.LeaveRequestUncheckedCreateInput, // ✅ Allow unchecked FK
  });
}

export async function getLeaveRequests() {
  return prisma.leaveRequest.findMany({
    include: {
      staff: true,
      type: true,
      approvals: { include: { approver: true } },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function updateLeaveRequest(
  id: number,
  data: Partial<LeaveRequestInput>
) {
  let duration: number | undefined;
  if (data.start_date && data.end_date) {
    duration =
      Math.ceil(
        (data.end_date.getTime() - data.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
  }

  return prisma.leaveRequest.update({
    where: { id },
    data: { ...data, ...(duration ? { duration } : {}) } as Prisma.LeaveRequestUncheckedUpdateInput,
  });
}

export async function deleteLeaveRequest(id: number) {
  return prisma.leaveRequest.delete({ where: { id } });
}

// ==========================
// Leave Approvals
// ==========================
export async function createApproval(data: ApprovalInput) {
  return prisma.approval.create({ data });
}

export async function getApprovalsForLeave(leave_id: number) {
  return prisma.approval.findMany({
    where: { leave_id },
    include: { approver: true },
  });
}

export async function updateApproval(id: number, data: Partial<ApprovalInput>) {
  return prisma.approval.update({ where: { id }, data });
}

export async function deleteApproval(id: number) {
  return prisma.approval.delete({ where: { id } });
}

// ==========================
// Leave Balances
// ==========================
type ApprovedGroup = {
  type_id: number;
  _sum: { duration: number | null };
};

export async function getLeaveBalances(staffId: string) {
  const leaveTypes = await prisma.leaveType.findMany();

  const approved = (await prisma.leaveRequest.groupBy({
    by: ["type_id"],
    where: { staff_id: staffId, status: "APPROVED" },
    _sum: { duration: true },
  })) as ApprovedGroup[];

  return leaveTypes.map((type) => {
    const used = approved.find((a) => a.type_id === type.id)?._sum.duration ?? 0;
    const remaining =
      type.max_days != null ? Math.max(type.max_days - used, 0) : null;

    return {
      type: type.name,
      used,
      remaining,
      max: type.max_days,
    };
  });
}
