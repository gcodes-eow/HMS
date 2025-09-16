// lib/routes.ts
type RouteAccessProps = {
  [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
  "/admin(.*)": ["admin"],
  "/doctor(.*)": ["doctor"],
  "/nurse(.*)": ["nurse", "doctor"],
  "/patient(.*)": ["patient", "admin", "doctor", "nurse"],
  "/cashier(.*)": ["cashier"],
  "/pharmacist(.*)": ["pharmacist", "admin"],
  "/receptionist(.*)": ["receptionist"],
  "/laboratory(.*)": ["laboratory", "admin", "doctor", "nurse"],
  "/record/users": ["admin"],
  "/record/doctors": ["admin"],
  "/record/services": ["admin", "nurse", "doctor", "receptionist", "pharmacist"],
  "/record/doctors(.*)": ["admin", "doctor"],
  "/record/staffs": ["admin", "doctor"],
  "/record/patients": ["admin", "doctor", "nurse", "receptionist"],
  "/record/appointments": ["admin", "doctor", "nurse", "receptionist", "patient"],
  "/record/medical-records": ["admin", "doctor", "nurse"],
  "/record/billing": ["admin", "doctor", "cashier", "receptionist"],
  "/patient/registrations": ["patient", "receptionist"],
  "/nurse/patient-management": ["admin", "doctor", "nurse"],
  "/nurse/administer-medications": ["admin", "doctor", "nurse", "pharmacist"],
  "/admin/inventory(.*)": ["admin", "pharmacist"],
};