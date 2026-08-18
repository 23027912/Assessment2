import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackRequest, getClientId } from "@/lib/requestCounter";

type Params = { params: { id: string } };

// GET /api/feeds/:id - fetch a single feed
export async function GET(req: NextRequest, { params }: Params) {
  const clientId = getClientId(req);
  await trackRequest({ route: "/api/feeds/:id", method: "GET", clientId, feedId: params.id });

  const feed = await prisma.feed.findUnique({ where: { id: params.id } });
  if (!feed) {
    return NextResponse.json({ success: false, error: "Feed not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: feed });
}

// PUT /api/feeds/:id - update an existing feed
export async function PUT(req: NextRequest, { params }: Params) {
  const clientId = getClientId(req);
  await trackRequest({ route: "/api/feeds/:id", method: "PUT", clientId, feedId: params.id });

  try {
    const body = await req.json();
    const { title, author, content, summary, imageUrl, link, category, status, publishedAt } =
      body;

    const feed = await prisma.feed.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(author !== undefined ? { author } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(summary !== undefined ? { summary } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(link !== undefined ? { link } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: feed });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Feed not found" }, { status: 404 });
    }
    console.error("Error updating feed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update feed" },
      { status: 500 }
    );
  }
}

// DELETE /api/feeds/:id - remove a feed
export async function DELETE(req: NextRequest, { params }: Params) {
  const clientId = getClientId(req);
  await trackRequest({ route: "/api/feeds/:id", method: "DELETE", clientId, feedId: params.id });

  try {
    await prisma.feed.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Feed deleted" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Feed not found" }, { status: 404 });
    }
    console.error("Error deleting feed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}
