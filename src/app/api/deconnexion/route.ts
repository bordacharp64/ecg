import { NextResponse } from "next/server";

import { closeSession } from "@/lib/auth";

export async function POST(request: Request) {
  await closeSession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
