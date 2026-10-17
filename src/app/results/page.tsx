"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem("quizResults");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  if (!results) return <div className="p-10 text-center font-medium text-slate-600">Loading results...</div>;

  const percentage = Math.round((results.score / results.total) * 100);
  
  // Professional colors based on score
  const getScoreColor = () => {
    if (percentage >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (percentage >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Assessment Results</h1>
          <p className="text-slate-500">Review your performance and identify areas for improvement.</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${getScoreColor()}`}>
              <span className="text-2xl font-bold">{percentage}%</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Quiz Completed</h2>
              <p className="text-slate-500">
                You answered <span className="font-bold text-slate-800">{results.score}</span> out of <span className="font-bold text-slate-800">{results.total}</span> questions correctly.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Return Home
            </Link>
            <Link href="/quiz" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Try Again
            </Link>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex justify-center">
          <button 
            onClick={() => setShowReview(!showReview)}
            className="px-8 py-3 bg-white border border-slate-300 text-slate-800 font-semibold rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex items-center gap-2"
          >
            {showReview ? "Hide Detailed Review" : "Review Your Answers"}
          </button>
        </div>

        {/* Detailed Review Section (Only shows if button is clicked) */}
        {showReview && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Detailed Review</h3>
            
            {results.answers.map((ans: any, index: number) => {
              const isCorrect = ans.isCorrect;
              
              return (
                <div key={index} className={`bg-white rounded-xl border p-6 ${isCorrect ? 'border-slate-200' : 'border-red-200 shadow-sm'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {index + 1}
                    </span>
                    <h4 className="text-slate-800 font-medium leading-relaxed mt-1">
                      {ans.question.questionText}
                    </h4>
                  </div>

                  <div className="space-y-2 ml-11">
                    {["A", "B", "C", "D"].map((letter) => {
                      const optionText = ans.question[`option${letter}`];
                      if (!optionText) return null;

                      const isSelected = ans.selected === letter;
                      const isCorrectOption = ans.correct === letter;

                      let optionClass = "p-3 rounded-lg border text-sm ";
                      if (isCorrectOption) {
                        optionClass += "bg-emerald-50 border-emerald-200 text-emerald-900 font-medium";
                      } else if (isSelected && !isCorrect) {
                        optionClass += "bg-red-50 border-red-200 text-red-900";
                      } else {
                        optionClass += "bg-slate-50 border-slate-100 text-slate-600";
                      }

                      return (
                        <div key={letter} className={optionClass}>
                          <span className="font-bold mr-2">{letter}.</span>
                          {optionText}
                          {isCorrectOption && <span className="ml-2 text-emerald-600 text-xs uppercase font-bold tracking-wider">(Correct)</span>}
                          {isSelected && !isCorrect && <span className="ml-2 text-red-500 text-xs uppercase font-bold tracking-wider">(Your Answer)</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Optional Explanation (If we parsed it) */}
                  {ans.question.explanation && (
                    <div className="mt-4 ml-11 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                      <p className="font-semibold text-slate-700 mb-1">Explanation:</p>
                      {ans.question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}