// app/actions/leave.ts
"use server";

import prisma from "@/lib/db";
import { LeaveTypeInput, LeaveRequestInput, ApprovalInput } from "@/types/leave";
import { Prisma } from "@prisma/client";

// ==========================
// Leave Type Actions
// ==========================
export const createLeaveType = async (data: LeaveTypeInput) =>
  prisma.leaveType.create({ data });

export const getLeaveTypes = async () =>
  prisma.leaveType.findMany({ orderBy: { name: "asc" } });

export const updateLeaveType = async (id: number, data: LeaveTypeInput) =>
  prisma.leaveType.update({ where: { id }, data });

export const deleteLeaveType = async (id: number) =>
  prisma.leaveType.delete({ where: { id } });

// ==========================
// Leave Request Actions
// ==========================
export const createLeaveRequest = async (data: LeaveRequestInput) => {
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
    } as Prisma.LeaveRequestUncheckedCreateInput,
  });
};

export const getLeaveRequests = async () =>
  prisma.leaveRequest.findMany({
    include: {
      staff: true,
      type: true,
      approvals: { include: { approver: true } },
    },
    orderBy: { created_at: "desc" },
  });

export const updateLeaveRequest = async (
  id: number,
  data: Partial<LeaveRequestInput>
) => {
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
};

export const deleteLeaveRequest = async (id: number) =>
  prisma.leaveRequest.delete({ where: { id } });

// ==========================
// Leave Approval Actions
// ==========================
export const createApproval = async (data: ApprovalInput) =>
  prisma.approval.create({ data });

export const getLeaveApprovals = async (leave_id: number) =>
  prisma.approval.findMany({
    where: { leave_id },
    include: { approver: true },
  });

export const updateApproval = async (
  id: number,
  data: Partial<ApprovalInput>
) =>
  prisma.leaveRequest.update({
    where: { id },
    data,
  });

export const deleteApproval = async (id: number) =>
  prisma.approval.delete({ where: { id } });

// ==========================
// Leave Balances
// ==========================
export const getLeaveBalances = async (staffId: string) => {
  const leaveTypes = await prisma.leaveType.findMany();

  type ApprovedGroup = {
    type_id: number;
    _sum: { duration: number | null };
  };

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
};
