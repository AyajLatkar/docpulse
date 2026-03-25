import { PrismaClient, Role, AppointmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const doctors = [
  { name: "Dr. Sarah Williams", email: "sarah.williams@docpulse.com", specialty: "Cardiology" },
  { name: "Dr. James Chen", email: "james.chen@docpulse.com", specialty: "Neurology" },
  { name: "Dr. Priya Patel", email: "priya.patel@docpulse.com", specialty: "Pediatrics" },
  { name: "Dr. Michael Torres", email: "michael.torres@docpulse.com", specialty: "Orthopedics" },
  { name: "Dr. Emily Johnson", email: "emily.johnson@docpulse.com", specialty: "Dermatology" },
];

const patients = [
  { name: "Alice Thompson", email: "alice.thompson@example.com" },
  { name: "Bob Martinez", email: "bob.martinez@example.com" },
  { name: "Carol Davis", email: "carol.davis@example.com" },
  { name: "David Wilson", email: "david.wilson@example.com" },
  { name: "Emma Brown", email: "emma.brown@example.com" },
  { name: "Frank Lee", email: "frank.lee@example.com" },
  { name: "Grace Kim", email: "grace.kim@example.com" },
  { name: "Henry Clark", email: "henry.clark@example.com" },
];

const diagnoses = [
  { diagnosis: "Hypertension Stage 1", prescription: "Lisinopril 10mg daily, Amlodipine 5mg daily" },
  { diagnosis: "Type 2 Diabetes Mellitus", prescription: "Metformin 500mg twice daily, dietary modifications" },
  { diagnosis: "Migraine with Aura", prescription: "Sumatriptan 50mg as needed, Topiramate 25mg nightly" },
  { diagnosis: "Acute Bronchitis", prescription: "Azithromycin 500mg for 5 days, Salbutamol inhaler" },
  { diagnosis: "Vitamin D Deficiency", prescription: "Vitamin D3 2000 IU daily, Calcium 500mg daily" },
  { diagnosis: "Anxiety Disorder", prescription: "Sertraline 50mg daily, CBT therapy recommended" },
  { diagnosis: "Osteoarthritis - Knee", prescription: "Ibuprofen 400mg TID, Physiotherapy 3x/week" },
  { diagnosis: "Eczema - Atopic Dermatitis", prescription: "Hydrocortisone 1% cream, Cetirizine 10mg nightly" },
];

const times = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];
const statuses: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const reasons = ["Routine Checkup", "Follow-up Visit", "New Symptoms", "Prescription Renewal", "Lab Results Review", "Specialist Referral"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysOffset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d;
}

async function main() {
  console.log("🌱 Seeding DocPulse database...");

  const password = await bcrypt.hash("password123", 12);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@docpulse.com" },
    update: {},
    create: { name: "Admin User", email: "admin@docpulse.com", password, role: Role.ADMIN },
  });
  console.log("✅ Admin created:", admin.email);

  // Demo doctor & patient for login page
  await prisma.user.upsert({
    where: { email: "doctor@docpulse.com" },
    update: {},
    create: { name: "Dr. Demo Doctor", email: "doctor@docpulse.com", password, role: Role.DOCTOR, specialty: "General Medicine" },
  });

  await prisma.user.upsert({
    where: { email: "patient@docpulse.com" },
    update: {},
    create: { name: "Demo Patient", email: "patient@docpulse.com", password, role: Role.PATIENT },
  });

  // Doctors
  const createdDoctors = await Promise.all(
    doctors.map((d) =>
      prisma.user.upsert({
        where: { email: d.email },
        update: {},
        create: { ...d, password, role: Role.DOCTOR },
      })
    )
  );
  console.log(`✅ ${createdDoctors.length} doctors created`);

  // Patients
  const createdPatients = await Promise.all(
    patients.map((p) =>
      prisma.user.upsert({
        where: { email: p.email },
        update: {},
        create: { ...p, password, role: Role.PATIENT },
      })
    )
  );
  console.log(`✅ ${createdPatients.length} patients created`);

  // Appointments + Medical Records
  let aptCount = 0;
  let recCount = 0;

  for (const patient of createdPatients) {
    const numApts = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numApts; i++) {
      const doctor = randomItem(createdDoctors);
      const status = randomItem(statuses);
      const daysOffset = Math.floor(Math.random() * 60) - 30;

      const apt = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          date: randomDate(daysOffset),
          time: randomItem(times),
          status,
          reason: randomItem(reasons),
          notes: status === "COMPLETED" ? "Patient responded well to treatment. Follow-up in 4 weeks." : null,
        },
      });
      aptCount++;

      // Create medical record for completed appointments
      if (status === "COMPLETED") {
        const diagData = randomItem(diagnoses);
        await prisma.medicalRecord.create({
          data: {
            patientId: patient.id,
            doctorId: doctor.id,
            appointmentId: apt.id,
            diagnosis: diagData.diagnosis,
            prescription: diagData.prescription,
            notes: "Patient vitals stable. Blood pressure within normal range. Advised lifestyle modifications.",
          },
        });
        recCount++;
      }
    }
  }

  console.log(`✅ ${aptCount} appointments created`);
  console.log(`✅ ${recCount} medical records created`);
  console.log("\n🎉 Seed complete! Login credentials:");
  console.log("   Admin:   admin@docpulse.com / password123");
  console.log("   Doctor:  doctor@docpulse.com / password123");
  console.log("   Patient: patient@docpulse.com / password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
