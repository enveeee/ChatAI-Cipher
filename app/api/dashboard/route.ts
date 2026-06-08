import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalMessages, totalRooms, totalUsers, recentMessages, rooms] =
      await Promise.all([
        prisma.message.count(),
        prisma.room.count(),
        prisma.user.count(),
        prisma.message.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { user: { select: { name: true } }, room: { select: { name: true } } },
        }),
        prisma.room.findMany({
          include: {
            _count: { select: { members: true, messages: true } },
          },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    return NextResponse.json({
      totalMessages,
      totalRooms,
      totalUsers,
      recentMessages,
      rooms,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}