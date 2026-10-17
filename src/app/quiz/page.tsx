"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (isLoading) return <div className="p-10 text-center font-medium">Loading 10 random questions...</div>;
  if (questions.length === 0) return <div className="p-10 text-center">No questions found. Please import a PDF first.</div>;

  const currentQuestion = questions[currentIndex];
  const correctAnswer = JSON.parse(currentQuestion.correctAnswers)[0];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      alert(`Quiz Complete! Your score: ${score} / ${questions.length}`);
      window.location.href = "/"; // Go back home
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
              buttonClass += "border-green-500 bg-green-50";
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
              {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}

      </div>
      
      <Link href="/" className="mt-8 text-slate-500 hover:text-blue-600 underline">
        Return to Home
      </Link>
    </div>
  );
}