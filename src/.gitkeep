import pdf from 'pdf-parse';

// We define the shape of the question we want to extract
export interface ParsedQuestion {
  sourceId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string; // JSON string of array
  explanation?: string;
}

export async function extractQuestionsFromPdf(pdfBuffer: Buffer): Promise<ParsedQuestion[]> {
  // 1. Extract raw text from the PDF buffer
  const data = await pdf(pdfBuffer);
  const rawText = data.text;

  // 2. Split the text into individual blocks based on "QUESTION X"
  const questionBlocks = rawText.split(/(?=QUESTION \d+)/i).slice(1); // slice(1) removes the header before Question 1

  const parsedQuestions: ParsedQuestion[] = [];

  for (const block of questionBlocks) {
    try {
      // Extract Question Number (e.g., "QUESTION 2")
      const questionNumberMatch = block.match(/QUESTION (\d+)/i);
      const sourceId = questionNumberMatch ? `AZ-900-Q${questionNumberMatch[1]}` : null;
      
      if (!sourceId) continue;

      // Extract the Question Text (text between the number and option A)
      const questionTextMatch = block.match(/QUESTION \d+\s*([\s\S]*?)(?=\s*A\.)/i);
      const questionText = questionTextMatch ? questionTextMatch[1].trim() : '';

      // Extract Options
      const optionAMatch = block.match(/A\.\s*([\s\S]*?)(?=\s*B\.)/i);
      const optionBMatch = block.match(/B\.\s*([\s\S]*?)(?=\s*C\.)/i);
      const optionCMatch = block.match(/C\.\s*([\s\S]*?)(?=\s*D\.)/i);
      
      // Option D goes up to the Answer line
      const optionDMatch = block.match(/D\.\s*([\s\S]*?)(?=\s*Answer:)/i);

      // Extract Answer (e.g., "Answer: A" or "Answer: DE")
      const answerMatch = block.match(/Answer:\s*([A-E]+)/i);
      
      // Extract Explanation (optional, might not exist)
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
      console.error(`Failed to parse block: ${block.substring(0, 50)}...`, error);
      // We catch the error and continue so one bad question doesn't stop the whole file
    }
  }

  return parsedQuestions;
}