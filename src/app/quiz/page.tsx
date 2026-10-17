"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  sourceId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string;
  explanation?: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (isLoading) return <div className="p-10 text-center font-medium text-slate-600">Loading your quiz...</div>;
  if (questions.length === 0) return <div className="p-10 text-center text-slate-600">No questions found. Please import a PDF first.</div>;

  const currentQuestion = questions[currentIndex];
  const correctAnswer = JSON.parse(currentQuestion.correctAnswers)[0];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selected: option,
        correct: correctAnswer,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      localStorage.setItem("quizResults", JSON.stringify({
        score,
        total: questions.length,
        answers
      }));
      router.push("/results");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 p-8 mt-10">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-xl font-bold text-slate-800">Azure Practice Quiz</h1>
          <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        <h2 className="text-lg font-medium text-slate-900 mb-6">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-3">
          {["A", "B", "C", "D"].map((letter) => {
            const optionText = currentQuestion[`option${letter}` as keyof Question] as string;
            if (!optionText) return null;

            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            if (!isAnswered) {
              buttonClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
            } else if (letter === correctAnswer) {
              buttonClass += "border-emerald-500 bg-emerald-50";
            } else if (letter === selectedAnswer && letter !== correctAnswer) {
              buttonClass += "border-red-500 bg-red-50";
            } else {
              buttonClass += "border-slate-200 opacity-50";
            }

            return (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span className="font-bold mr-3">{letter}.</span>
                {optionText}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}