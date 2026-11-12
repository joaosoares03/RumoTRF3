import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.exam.count();
    return NextResponse.json({ status: "ok", time: new Date().toISOString() });
  } catch (e) {
    console.error("health:", (e as Error).message.slice(0, 600));
    return NextResponse.json({ status: "erro", detalhe: "banco indisponível" }, { status: 503 });
  }
}
