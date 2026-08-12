import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackRequest } from "@/lib/requestCounter";

// GET /api/feeds - list all feeds, newest first. Supports ?author= and ?category= filters.
export async function GET(req: NextRequest) {
  await trackRequest("GET /api/feeds");

  const { searchParams } = new URL(req.url);
  const author = searchParams.get("author") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  try {
    const feeds = await prisma.feed.findMany({
      where: {
        ...(author ? { author: { equals: author, mode: "insensitive" } } : {}),
        ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
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
  await trackRequest("POST /api/feeds");

  try {
    const body = await req.json();
    const { title, author, content, summary, imageUrl, link, category, publishedAt } = body;

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
