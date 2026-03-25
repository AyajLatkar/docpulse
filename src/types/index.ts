import { Role, AppointmentStatus } from "@prisma/client";

export type { Role, AppointmentStatus };

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
}

export interface AppointmentWithRelations {
  id: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  reason?: string | null;
  notes?: string | null;
  patient: { id: string; name: string; email: string; image?: string | null };
  doctor: { id: string; name: string; specialty?: string | null; image?: string | null };
}

export interface MedicalRecordWithRelations {
  id: string;
  diagnosis: string;
  prescription?: string | null;
  notes?: string | null;
  createdAt: Date;
  patient: { id: string; name: string };
  doctor: { id: string; name: string; specialty?: string | null };
}
