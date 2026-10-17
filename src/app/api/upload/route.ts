import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractQuestionsFromPdf } from '@/services/pdfParser';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Parse the PDF
    const questions = await extractQuestionsFromPdf(buffer);

    // 2. Save to Database
    let savedCount = 0;
    for (const q of questions) {
      // Check if it already exists to prevent duplicates
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
            isVerified: false, // Needs admin review later
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

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}