import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractQuestionsFromPdf } from '@/services/pdfParser';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Starting extraction on server...");
    const questions = await extractQuestionsFromPdf(buffer);
    console.log(`Extracted ${questions.length} questions.`);

    let savedCount = 0;
    for (const q of questions) {
      const existing = await prisma.question.findFirst({
        where: { sourceId: q.sourceId }
      });

      if (!existing) {
        await prisma.question.create({
          data: {
            sourceType: 'PDF',
            sourceId: q.sourceId,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation,
            isVerified: false,
          }
        });
        savedCount++;
      }
    }

    return NextResponse.json({ 
      message: 'PDF processed successfully', 
      totalFound: questions.length,
      newQuestionsSaved: savedCount 
    });

  } catch (error: any) {
    console.error('--- UPLOAD ERROR ---', error);
    return NextResponse.json({ 
      error: 'Failed to process PDF', 
      details: error.message 
    }, { status: 500 });
  }
}