import { db } from '@/config/db';
import { enrollmentsTable } from '@/config/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    
    // Get all approved students enrolled in this course
    const students = await db
      .select({
        id: enrollmentsTable.id,
        student_id: enrollmentsTable.student_id,
        student_name: enrollmentsTable.student_name,
        student_email: enrollmentsTable.student_email,
        course_id: enrollmentsTable.course_id,
        course_title: enrollmentsTable.course_title,
        teacher_name: enrollmentsTable.teacher_name,
        teacher_email: enrollmentsTable.teacher_email,
        status: enrollmentsTable.status,
        progress: enrollmentsTable.progress,
        last_accessed: enrollmentsTable.last_accessed,
        created_at: enrollmentsTable.created_at
      })
      .from(enrollmentsTable)
      .where(
        and(
          eq(enrollmentsTable.course_id, parseInt(id)),
          eq(enrollmentsTable.status, 'approved')
        )
      );

    console.log(`📧 Found ${students.length} enrolled students for course ${id}`);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}