# Source Data Analysis: AZ-900.pdf

## 1. Document Overview

- **Source File:** AZ-900.pdf
- **Vendor:** PassLeader
- **Exam Code:** AZ-900
- **Version:** 25.051
- **Total Pages:** 356
- **Total Questions (Approx):** 527
- **Description:** A collection of multiple-choice, hotspot (drag-and-drop, yes/no), and "evaluate the underlined text" questions for the Microsoft Azure Fundamentals exam.

## 2. Question Structure Analysis

This section analyzes the common patterns and variations found in the questions.

### 2.1. Standard Multiple-Choice Questions

- **Pattern:** These questions have a clear question number (e.g., `QUESTION 1`), a body of text, a list of options (A, B, C, D), and an explicit `Answer:` line.
- **Example:** Question 2, Question 4, Question 8.
- **Key Data Points to Extract:**
    - Question Number
    - Question Text (the full body)
    - Options (the text for A, B, C, etc.)
    - Correct Answer(s)

### 2.2. "Evaluate the Underlined Text" Questions

- **Pattern:** The question body contains a sentence with "underlined text" (which appears as plain text in our file). The instructions are standard. The options are typically "No change is needed" or a set of alternative phrases.
- **Example:** Question 1, Question 3, Question 11.
- **Key Data Points to Extract:** Same as 2.1.
- **Challenge:** The "underlined text" is not visually marked in the extracted text, so the parser will need to identify the statement to be evaluated based on the answer options.

### 2.3. "Series of Questions" Scenario-Based Questions

- **Pattern:** A block of text begins with a note (e.g., `Note: This question is part of a series of questions...`). This is followed by a scenario and a proposed solution. The question is always "Does this meet the goal?" with "Yes" or "No" options.
- **Example:** Question 5, 6, 7, 14, 15, 16.
- **Key Data Points to Extract:** The scenario text, the proposed solution, and the Yes/No answer. These questions should likely be grouped in the database.

### 2.4. Hotspot / Drag-and-Drop Questions

- **Pattern:** These are much more complex. They may present statements to be marked Yes/No, or ask you to match items from a list to descriptions. The answer is often provided as an image or a formatted text block showing the correct matches or Yes/No selections.
- **Example:** Question 32, 36, 41, 48.
- **Key Data Points to Extract:** The question text and the correct answer representation. These will require a more flexible data model and potentially manual review in the application.
- **Challenge:** The answers are sometimes described in the text (e.g., `Answer: CD` for Question 29) and sometimes shown in an image or a copied table. Our initial parser may only be able to handle the text-based answers.

### 2.5. Answer and Explanation Format

- **Pattern:** The correct answer is usually provided on a line starting with `Answer:`. Sometimes it's followed by an `Explanation:` section. The explanation can contain multiple paragraphs and reference links.
- **Example:** Question 2 has a detailed explanation. Question 8 has a shorter one.
- **Key Data Points to Extract:**
    - Correct Answer (e.g., "A", "DE", "C")
    - Explanation Text (optional, but valuable for the AI-assisted features)

## 3. Identified Challenges and Inconsistencies

This section lists the "gotchas" that our parser and database schema must handle.

1.  **Inconsistent Formatting:** There are variations in spacing and formatting. For example, sometimes `Answer:A` and sometimes `Answer: A`. Our parser must be case-insensitive and whitespace-tolerant.
2.  **Multiple Correct Answers:** Questions 4 (`DE`), 29 (`CD`), and 62 (`AC`) have multiple correct answers. The data model must support an array of correct answers, not just a single string.
3.  **Image-Based Answers:** Many hotspot questions (e.g., Question 32, 35, 37) have their answers embedded in images. The text extraction may not capture the answer. These will be flagged for manual review in the app's admin interface.
4.  **Text Extraction Artifacts:** The PDF text includes artifacts like `===== Page 1 =====` and "PassLeader" branding on some pages. The parser should be designed to ignore or strip these.
5.  **Question Grouping:** The "series of questions" (e.g., 5, 6, 7) share a common scenario. This relationship should be captured in the database so the app can present them as a set.
6.  **Missing Explanations:** Not all questions have an `Explanation:` section. The parser must not fail if it's missing.
7.  **Page Breaks:** Questions and answers are often split across pages (e.g., Question 2 starts on page 3 and ends on page 4). The parser must be able to stitch together content across page breaks.

## 4. Proposed Data Model (Preliminary)

Based on this analysis, here is a preliminary idea for the `Question` entity. This will be formalized in the ERD.

- `id` (Primary Key)
- `source` (e.g., 'PassLeader', 'AI-Generated')
- `question_text` (The full text of the question)
- `option_a` (Text for option A)
- `option_b` (Text for option B)
- `option_c` (Text for option C)
- `option_d` (Text for option D)
- `option_e` (Text for option E, nullable)
- `correct_answers` (A JSON array of strings, e.g., `["D"]` or `["D", "E"]`)
- `explanation` (The explanation text, nullable)
- `topic` (e.g., 'Cloud Concepts', 'Azure Services', nullable, for classification)
- `difficulty` (e.g., 'Easy', 'Medium', 'Hard', nullable)
- `has_image` (Boolean, true if the question relies on an image not captured in text)
- `source_question_id` (String, e.g., 'AZ-900-Q2')
- `scenario_group_id` (String, a UUID to group related questions like 5,6,7)

## 5. Conclusion and Next Steps

The primary source data is rich but unstructured. A simple, naive parser will fail. We must design a robust parsing strategy that can handle the identified variations and inconsistencies.

**Next Step:** We will use this analysis to define the formal Requirements and System Architecture.