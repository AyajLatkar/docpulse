import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, password, specialty, phone } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already in use." }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);
  const doctor = await prisma.user.create({
    data: { name, email, password: hashed, role: "DOCTOR", specialty, phone },
  });

  return NextResponse.json(doctor, { status: 201 });
}
