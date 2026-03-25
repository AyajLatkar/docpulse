import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, phone } = await req.json();
  const id = (session.user as any).id;

  const user = await prisma.user.update({
    where: { id },
    data: { name, email, phone },
  });

  return NextResponse.json(user);
}
