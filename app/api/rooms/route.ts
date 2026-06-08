import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Look up user by email instead of relying on session.id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const memberships = await prisma.roomMember.findMany({
      where: { userId: user.id },
      include: { room: true },
    });

    const rooms = memberships.map((m) => m.room);
    return NextResponse.json(rooms);

  } catch (error) {
    console.error("ROOMS GET ERROR:", error);
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { name } = await req.json();
    const room = await prisma.room.create({ data: { name } });

    await prisma.roomMember.create({
      data: { userId: user.id, roomId: room.id },
    });

    return NextResponse.json(room);

  } catch (error) {
    console.error("ROOMS POST ERROR:", error);
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}