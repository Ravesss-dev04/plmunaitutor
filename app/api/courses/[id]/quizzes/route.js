// app/api/courses/[id]/quizzes/route.js
import { db } from '@/config/db';
import { quizzesTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const quizzes = await db
      .select()
      .from(quizzesTable)
      .where(eq(quizzesTable.course_id, id))
      .orderBy(quizzesTable.created_at);

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { title, description, questions, deadline } = await request.json();

    const newQuiz = await db
      .insert(quizzesTable)
      .values({
        course_id: id,
        title,
        description,
        questions: questions || [],
        deadline: deadline ? new Date(deadline) : null
      })
      .returning();

    return NextResponse.json(newQuiz[0], { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}