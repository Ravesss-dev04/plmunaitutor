import { db } from '@/config/db';
import { enrollmentsTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    
    const students = await db
      .select()
      .from(enrollmentsTable)
      .where(eq(enrollmentsTable.course_id, id))
      .where(eq(enrollmentsTable.status, 'approved'));

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}