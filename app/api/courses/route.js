import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("📦 Fetching all courses...");
    const allCourses = await db.select().from(coursesTable).orderBy(coursesTable.created_at);
    console.log(`✅ Found ${allCourses.length} courses`);
    return NextResponse.json(allCourses);
  } catch (error) {
    console.error("❌ GET Courses Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const courseData = await request.json();
    console.log("🆕 Creating course:", courseData);

    // Generate slug if not provided
    if (!courseData.slug) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const newCourse = await db.insert(coursesTable).values(courseData).returning();
    console.log("✅ Course created successfully:", newCourse[0]);
    
    return NextResponse.json(newCourse[0], { status: 201 });

  } catch (error) {
    console.error("❌ POST Courses Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}