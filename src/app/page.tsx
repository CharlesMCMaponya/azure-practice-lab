import Link from "next/link";
import UploadForm from "./UploadForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navigation Bar */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Azure Practice Lab
            </span>
          </div>
          <nav>
            <Link 
              href="#features" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl space-y-8 mt-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Master Azure with <br />
            <span className="text-blue-600">Confidence.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your certification PDFs into a structured question bank. 
            Practice with quizzes, flashcards, and timed assessments designed to help you pass on the first try.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 pt-4 w-full">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
              Start Practicing
            </button>
            
            {/* The new Upload Component */}
            <UploadForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 mt-20">
        <p>© 2026 Azure Practice Lab. Built by Mosehla Charles Maponya.</p>
      </footer>
    </div>
  );
}