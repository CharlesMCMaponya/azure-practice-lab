// Importing directly from the lib folder bypasses the broken index.js file
const pdf = require('pdf-parse/lib/pdf-parse.js');

export interface ParsedQuestion {
  sourceId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string;
  explanation?: string;
}

export async function extractQuestionsFromPdf(pdfBuffer: Buffer): Promise<ParsedQuestion[]> {
  // 1. Extract raw text using the stable pdf-parse library
  const data = await pdf(pdfBuffer);
  const rawText = data.text;

  // 2. Split the text into individual blocks based on "QUESTION X"
  const questionBlocks = rawText.split(/(?=QUESTION \d+)/i).slice(1);

  const parsedQuestions: ParsedQuestion[] = [];

  for (const block of questionBlocks) {
    try {
      const questionNumberMatch = block.match(/QUESTION (\d+)/i);
      const sourceId = questionNumberMatch ? `AZ-900-Q${questionNumberMatch[1]}` : null;
      
      if (!sourceId) continue;

      const questionTextMatch = block.match(/QUESTION \d+\s*([\s\S]*?)(?=\s*A\.)/i);
      const questionText = questionTextMatch ? questionTextMatch[1].trim() : '';

      const optionAMatch = block.match(/A\.\s*([\s\S]*?)(?=\s*B\.)/i);
      const optionBMatch = block.match(/B\.\s*([\s\S]*?)(?=\s*C\.)/i);
      const optionCMatch = block.match(/C\.\s*([\s\S]*?)(?=\s*D\.)/i);
      const optionDMatch = block.match(/D\.\s*([\s\S]*?)(?=\s*Answer:)/i);

      const answerMatch = block.match(/Answer:\s*([A-E]+)/i);
      const explanationMatch = block.match(/Explanation:\s*([\s\S]*?)(?=References:|$)/i);

      if (questionText && optionAMatch && answerMatch) {
        parsedQuestions.push({
          sourceId,
          questionText,
          optionA: optionAMatch[1].trim(),
          optionB: optionBMatch ? optionBMatch[1].trim() : '',
          optionC: optionCMatch ? optionCMatch[1].trim() : '',
          optionD: optionDMatch ? optionDMatch[1].trim() : '',
          correctAnswers: JSON.stringify([answerMatch[1].trim().toUpperCase()]),
          explanation: explanationMatch ? explanationMatch[1].trim() : undefined,
        });
      }
    } catch (error) {
      console.error(`Failed to parse block`, error);
    }
  }

  return parsedQuestions;
}