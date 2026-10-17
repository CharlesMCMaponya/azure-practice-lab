# Requirements & User Stories: Azure Practice Lab

## 1. Project Scope
Azure Practice Lab is a web application that transforms uploaded Azure certification PDFs into a structured question bank and multiple learning experiences. This document defines the core user stories for the MVP.

## 2. User Personas
- **The Candidate:** A professional studying for the AZ-900 (or similar) exam who wants to practice questions, take timed tests, and review their incorrect answers.
- **The Administrator (You):** The person who uploads the PDF, reviews the parsed questions for accuracy, and classifies them.

## 3. User Stories & Acceptance Criteria

### Epic 1: PDF Import & Management
- **US-1.1:** As an Administrator, I want to upload a PDF file containing exam questions so that the system can extract the data.
  - *Acceptance Criteria:* The system must accept PDF uploads, extract the text, and parse it into structured Question objects.
- **US-1.2:** As an Administrator, I want to review parsed questions so that I can verify the text was extracted correctly and fix any errors.
  - *Acceptance Criteria:* The admin interface must display the source text alongside the parsed fields (Question, Options, Answer) to allow for manual correction.
- **US-1.3:** As an Administrator, I want to classify questions by topic (e.g., "Cloud Concepts", "Security") so that candidates can filter their practice sessions.

### Epic 2: Learning Experiences
- **US-2.1:** As a Candidate, I want to take a multiple-choice quiz so that I can test my knowledge.
  - *Acceptance Criteria:* The user can select answers, submit them, and see immediate feedback (Correct/Incorrect).
- **US-2.2:** As a Candidate, I want to use flashcards so that I can review concepts quickly.
  - *Acceptance Criteria:* The user can see the question on one side and flip the card to reveal the answer.
- **US-2.3:** As a Candidate, I want to take a timed assessment so that I can simulate real exam conditions.
  - *Acceptance Criteria:* A visible countdown timer must run, and the quiz must auto-submit when time expires.

### Epic 3: Results & Review
- **US-3.1:** As a Candidate, I want to see a detailed report after a quiz so that I know my score and topic-level performance.
  - *Acceptance Criteria:* The results page must show the overall percentage, a breakdown of correct/incorrect answers, and specific areas for improvement.
- **US-3.2:** As a Candidate, I want to review my incorrect answers and history so that I can focus on my weak areas.
  - *Acceptance Criteria:* The user can see a history of past sessions and view explanations for questions they got wrong.

### Epic 4: AI Assistance (Phase 2)
- **US-4.1:** As a Candidate, I want AI-generated explanations for questions so that I can understand complex concepts better.
- **US-4.2:** As a Candidate, I want to practice AI-generated variations of questions so that I don't memorize answers.

## 4. Non-Functional Requirements
- **Accessibility:** The UI must be accessible (WCAG 2.1 AA compliant) with keyboard navigation and screen reader support.
- **Security:** Secrets (like AI API keys) must never be exposed in the frontend.
- **Responsiveness:** The application must work on desktop, tablet, and mobile.
- **Data Integrity:** Original questions from the PDF must be preserved as the "source of truth" and strictly separated from AI-generated variations.