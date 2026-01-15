import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "API is alive (GET)",
    ok: true,
  });
}

export async function POST() {
  return NextResponse.json({
    status: "API is alive (POST)",
    ok: true,
  });
}
