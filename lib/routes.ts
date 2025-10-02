// lib/routes.ts
type RouteAccessProps = {
  [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
  "/admin(.*)": ["admin"],
  "/doctor(.*)": ["doctor"],
  "/nurse(.*)": ["nurse", "doctor"],
  "/manager(.*)": ["manager"],
  "/patient(.*)": ["patient", "admin", "doctor", "nurse", "manager"],
  "/cashier(.*)": ["cashier"],
  "/pharmacist(.*)": ["pharmacist", "admin"],
  "/receptionist(.*)": ["receptionist"],
  "/laboratory(.*)": ["laboratory", "admin", "doctor", "nurse"],
  "/record/users": ["admin", "manager"],
  "/record/doctors": ["admin", "manager"],
  "/record/services": [
    "admin",
    "nurse",
    "doctor",
    "receptionist",
    "pharmacist",
    "manager",
  ],
  "/record/doctors(.*)": ["admin", "doctor", "manager"],
  "/record/staffs": ["admin", "doctor", "manager"],
  "/record/patients": [
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "manager",
  ],
  "/record/appointments": [
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "patient",
    "manager",
  ],
  "/record/medical-records": ["admin", "doctor", "nurse", "manager"],
  "/record/billing": ["admin", "doctor", "cashier", "receptionist", "manager"],
  "/patient/registrations": ["patient", "receptionist", "manager"],
  "/nurse/patient-management": ["admin", "doctor", "nurse", "manager"],
  "/nurse/administer-medications": [
    "admin",
    "doctor",
    "nurse",
    "pharmacist",
    "manager",
  ],
  "/admin/inventory(.*)": ["admin", "pharmacist", "manager"],

  // ✅ Split events access
  "/events$": ["admin", "manager"], // dashboard
  "/events/calendar(.*)": [
    "admin",
    "manager",
    "doctor",
    "nurse",
    "cashier",
    "pharmacist",
    "receptionist",
    "laboratory",
  ],

  // ✅ Split rosters access
  "/rosters$": ["admin", "manager"], // dashboard
  "/rosters/view-rosters(.*)": [
    "admin",
    "manager",
    "doctor",
    "nurse",
    "cashier",
    "pharmacist",
    "receptionist",
    "laboratory",
  ],

  "/leave-request(.*)": [
    "admin",
    "doctor",
    "nurse",
    "cashier",
    "pharmacist",
    "receptionist",
    "laboratory",
    "manager",
  ],
};
