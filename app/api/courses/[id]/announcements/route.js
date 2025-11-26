import { db } from '@/config/db';
import { announcementsTable } from '@/config/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    
    const announcements = await db
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.course_id, id))
      .orderBy(desc(announcementsTable.created_at));

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params; // Add await here
    const { message } = await request.json();

    const newAnnouncement = await db
      .insert(announcementsTable)
      .values({
        course_id: id,
        message
      })
      .returning();

    return NextResponse.json(newAnnouncement[0], { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}