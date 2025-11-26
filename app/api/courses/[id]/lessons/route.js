import { db } from '@/config/db';
import { lessonsTable } from '@/config/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    console.log(`📖 Fetching lessons for course ID: ${id}`);
    
    const lessons = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.course_id, parseInt(id)))
      .orderBy(asc(lessonsTable.order_index));

    console.log(`✅ Found ${lessons.length} lessons for course ${id}:`, lessons);
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('❌ Error fetching lessons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { title, content, video_url, order_index, status } = await request.json();

    console.log(`🆕 Creating lesson for course ${id}:`, { title, content, video_url, order_index, status });

    const newLesson = await db
      .insert(lessonsTable)
      .values({
        course_id: parseInt(id),
        title,
        content,
        video_url,
        order_index: order_index || 0,
        status: status || 'published'
      })
      .returning();

    console.log("✅ Lesson created successfully:", newLesson[0]);
    
    return NextResponse.json(newLesson[0], { status: 201 });
  } catch (error) {
    console.error('❌ Error creating lesson:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}