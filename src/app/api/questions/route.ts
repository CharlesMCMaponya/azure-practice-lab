import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching questions from database...");
    
    const count = await prisma.question.count();
    console.log(`Total questions in DB: ${count}`);

    if (count === 0) {
      return NextResponse.json({ error: 'No questions found in the database. Please upload a PDF.' }, { status: 404 });
    }

    const allQuestions = await prisma.question.findMany();
    
    // Shuffle the questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    
    // Return the first 10 questions
    const selected = shuffled.slice(0, 10);

    console.log(`Returning ${selected.length} random questions.`);
    return NextResponse.json(selected);

  } catch (error: any) {
    console.error('--- API ERROR ---');
    console.error(error);
    console.error('-----------------');
    
    // Return a JSON error, NOT an HTML page
    return NextResponse.json({ 
      error: 'Failed to fetch questions', 
      details: error.message 
    }, { status: 500 });
  }
}