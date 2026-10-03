import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth";

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");

  return expected.length === derived.length && timingSafeEqual(derived, expected);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin || !verifyPassword(String(password), admin.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    await createAdminSession(admin.email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in." },
      { status: 500 },
    );
  }
}
