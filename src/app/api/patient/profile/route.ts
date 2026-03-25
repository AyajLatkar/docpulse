import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "PATIENT")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = (session.user as any).id;
  const { name, phone } = await req.json();
  const user = await prisma.user.update({ where: { id }, data: { name, phone } });
  return NextResponse.json(user);
}
