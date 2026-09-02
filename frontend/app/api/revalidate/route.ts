import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

type RevalidationPayload = {
  secret?: string;
  path?: string;
};

function safePath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function POST(request: NextRequest) {
  let body: RevalidationPayload;

  try {
    body = (await request.json()) as RevalidationPayload;
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid JSON body" }, { status: 400 });
  }

  if (!process.env.REVALIDATION_SECRET || body.secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const path = safePath(body.path);
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/blog");

  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}

