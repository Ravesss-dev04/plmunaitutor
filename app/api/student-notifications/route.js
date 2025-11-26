import { db } from '@/config/db';
import { studentNotificationsTable } from '@/config/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id') || userId;
    
    if (!studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await db
      .select()
      .from(studentNotificationsTable)
      .where(eq(studentNotificationsTable.student_id, studentId))
      .orderBy(desc(studentNotificationsTable.created_at))
      .limit(10);

    return NextResponse.json(notifications);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { student_id, course_id, teacher_name, message, type, quiz_title, deadline } = await request.json();

    const notification = await db
      .insert(studentNotificationsTable)
      .values({
        student_id,
        course_id,
        teacher_name,
        message: message || `New ${type}: ${quiz_title}`,
        type: type || 'quiz',
        is_read: false
      })
      .returning();

    return NextResponse.json(notification[0]);

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}