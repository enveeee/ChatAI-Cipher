import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    let generalRoom = await prisma.room.findFirst({ where: { name: "general" } });
    if (!generalRoom) {
      generalRoom = await prisma.room.create({ data: { name: "general" } });
    }

    await prisma.roomMember.upsert({
      where: { userId_roomId: { userId: user.id, roomId: generalRoom.id } },
      update: {},
      create: { userId: user.id, roomId: generalRoom.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}