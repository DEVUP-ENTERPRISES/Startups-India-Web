'use client';

import { useState } from 'react';
import '../../styles/quiz.css';

export default function QuizForm({ quizzes, onSubmit, isSubmitting }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctAnswers = 0;
    const results = quizzes.map((quiz) => {
      const isCorrect = answers[quiz.id] === quiz.correct_answer;
      if (isCorrect) correctAnswers++;
      return {
        quiz_id: quiz.id,
        selected_option: answers[quiz.id],
        is_correct: isCorrect,
      };
    });

    const finalScore = Math.round((correctAnswers / quizzes.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Submit to parent
    if (onSubmit) {
      await onSubmit(results, finalScore);
    }
  };

  const progress = ((currentQuestion + 1) / quizzes.length) * 100;
  const currentQuiz = quizzes[currentQuestion];
  const isAnswered = answers[currentQuiz?.id] !== undefined;
  const allAnswered = quizzes.every((quiz) => answers[quiz.id] !== undefined);

  if (showResults) {
    const passed = score >= 75;
    const correctCount = quizzes.filter((quiz) => answers[quiz.id] === quiz.correct_answer).length;
    const incorrectCount = quizzes.length - correctCount;

    return (
      <div className="quiz-results">
        <div className={`results-icon ${passed ? 'success' : 'fail'}`}>
          {passed ? '🎉' : '😔'}
        </div>
        <h2 className="results-title">
          {passed ? 'Congratulations!' : 'Keep Learning'}
        </h2>
        <div className={`results-score ${passed ? 'pass' : 'fail'}`}>
          {score}%
        </div>
        <p className="results-message">
          {passed
            ? 'You have successfully passed the quiz! You can now proceed to the next lesson.'
            : 'You need at least 75% to pass. Review the material and try again.'}
        </p>
        <div className="results-stats">
          <div className="results-stat">
            <div className="results-stat-value">{quizzes.length}</div>
            <div className="results-stat-label">Total Questions</div>
          </div>
          <div className="results-stat">
            <div className="results-stat-value" style={{ color: 'var(--secondary-color)' }}>
              {correctCount}
            </div>
            <div className="results-stat-label">Correct</div>
          </div>
          <div className="results-stat">
            <div className="results-stat-value" style={{ color: 'var(--danger-color)' }}>
              {incorrectCount}
            </div>
            <div className="results-stat-label">Incorrect</div>
          </div>
        </div>
        {passed && (
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Continue Learning
          </button>
        )}
      </div>
    );
  }

  if (!currentQuiz) {
    return <div>No quiz questions available.</div>;
  }

  return (
    <div className="quiz-form">
      <div className="quiz-progress">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="quiz-progress-text">
          Question {currentQuestion + 1} of {quizzes.length}
        </div>
      </div>

      <div className="quiz-question-card">
        <span className="question-number">Question {currentQuestion + 1}</span>
        <h3 className="question-text">{currentQuiz.question}</h3>

        <div className="quiz-options">
          {currentQuiz.options.map((option, index) => (
            <label
              key={index}
              className={`quiz-option ${
                answers[currentQuiz.id] === index ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuiz.id}`}
                value={index}
                checked={answers[currentQuiz.id] === index}
                onChange={() => handleOptionSelect(currentQuiz.id, index)}
              />
              <span className="quiz-option-text">{option}</span>
            </label>
          ))}
        </div>

        <div className="quiz-navigation">
          <button
            className="btn btn-outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {currentQuestion < quizzes.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!isAnswered}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
