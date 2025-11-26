// app/api/user/route.js - FRESH COPY
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("🎯 API USER POST CALLED");
    
    const user = await currentUser();
    console.log("Clerk user:", user?.id);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, role } = await req.json();
    console.log("Request body:", { email, name, role });
    
    const safeName = name?.trim() || user.firstName || user.username || email?.split("@")[0] || "User";
    
    console.log("🔍 Checking for existing user...");
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    console.log("Existing users found:", existingUser.length);

    if (existingUser.length === 0) {
      console.log("🆕 Creating new user");
      const newUser = await db
        .insert(usersTable)
        .values({
          name: safeName,
          email: email,
          clerk_id: user.id,
          role: role || 'student',
        })
        .returning(); 

      console.log("✅ New user created:", newUser[0]);
      return NextResponse.json(newUser[0], { status: 201 });
    }

    console.log("✅ User exists:", existingUser[0]);
    return NextResponse.json(existingUser[0], { status: 200 });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "User API endpoint is working!",
    endpoint: "/api/user",
    method: "GET/POST"
  });
}