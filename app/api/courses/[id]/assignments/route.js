import { db } from '@/config/db';
import { assignmentsTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    
    const assignments = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.course_id, id))
      .orderBy(assignmentsTable.created_at);

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params; // Add await here
    const { title, description, deadline, max_score } = await request.json();

    const newAssignment = await db
      .insert(assignmentsTable)
      .values({
        course_id: id,
        title,
        description,
        deadline,
        max_score: max_score || 100
      })
      .returning();

    return NextResponse.json(newAssignment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}