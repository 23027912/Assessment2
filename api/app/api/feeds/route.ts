import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackRequest, getClientId } from "@/lib/requestCounter";

// GET /api/feeds - list all feeds, newest first. Supports ?author=, ?category=
// and ?status= filters.
export async function GET(req: NextRequest) {
  const clientId = getClientId(req);
  await trackRequest({ route: "/api/feeds", method: "GET", clientId });

  const { searchParams } = new URL(req.url);
  const author = searchParams.get("author") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  try {
    const feeds = await prisma.feed.findMany({
      where: {
        ...(author ? { author: { equals: author, mode: "insensitive" } } : {}),
        ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ success: true, count: feeds.length, data: feeds });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

// POST /api/feeds - create a new feed entry
export async function POST(req: NextRequest) {
  const clientId = getClientId(req);
  await trackRequest({ route: "/api/feeds", method: "POST", clientId });

  try {
    const body = await req.json();
    const { title, author, content, summary, imageUrl, link, category, status, publishedAt } =
      body;

    if (!title || !author || !content) {
      return NextResponse.json(
        { success: false, error: "title, author and content are required" },
        { status: 400 }
      );
    }

    const feed = await prisma.feed.create({
      data: {
        title,
        author,
        content,
        summary,
        imageUrl,
        link,
        category,
        ...(status ? { status } : {}),
        ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: feed }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create feed" },
      { status: 500 }
    );
  }
}
