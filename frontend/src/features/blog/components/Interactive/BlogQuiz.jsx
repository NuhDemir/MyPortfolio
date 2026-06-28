import React, { useState, useRef, useCallback, memo } from "react";
import "./BlogQuiz.css";

const BlogQuiz = memo(({ quizData }) => {
  const parsed = (() => {
    try {
      return typeof quizData === "string" ? JSON.parse(quizData) : quizData;
    } catch {
      return null;
    }
  })();

  const [selected, setSelected] = useState(null); // index or null
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const questionRef = useRef(null);

  if (!parsed || !parsed.question || !Array.isArray(parsed.options)) {
    return (
      <div className="bq-error">
        Gecersiz quiz verisi. question ve options alanlari zorunludur.
      </div>
    );
  }

  const { question, options, answer, explanation, hint } = parsed;

  // answer can be index (number) or the answer string
  const correctIndex = typeof answer === "number"
    ? answer
    : options.findIndex(o => o === answer);

  const handleSelect = useCallback((idx) => {
    if (submitted) return;
    setSelected(idx);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (selected === null || submitted) return;
    const isCorrect = selected === correctIndex;
    setSubmitted(true);
    setScore(isCorrect ? 1 : 0);
  }, [selected, submitted, correctIndex]);

  const handleReset = useCallback(() => {
    setSelected(null);
    setSubmitted(false);
    setScore(null);
    questionRef.current?.focus();
  }, []);

  const getOptionClass = (idx) => {
    let cls = "bq-option";
    if (selected === idx) cls += " bq-option--selected";
    if (submitted) {
      if (idx === correctIndex) cls += " bq-option--correct";
      else if (selected === idx) cls += " bq-option--wrong";
      else cls += " bq-option--neutral";
    }
    return cls;
  };

  return (
    <div className="bq-wrap" ref={questionRef} tabIndex={-1}>
      <div className="bq-header">
        <span className="bq-badge">Quiz</span>
        {hint && <span className="bq-hint">Ipucu: {hint}</span>}
      </div>

      <p className="bq-question">{question}</p>

      <div className="bq-options" role="radiogroup" aria-label={question}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            role="radio"
            aria-checked={selected === idx}
            className={getOptionClass(idx)}
            onClick={() => handleSelect(idx)}
            disabled={submitted}
          >
            <span className="bq-option__marker">
              {submitted && idx === correctIndex && "✓"}
              {submitted && idx !== correctIndex && selected === idx && "✗"}
              {!submitted && String.fromCharCode(65 + idx)}
            </span>
            <span className="bq-option__text">{opt}</span>
          </button>
        ))}
      </div>

      {!submitted ? (
        <div className="bq-actions">
          <button
            className="bq-submit"
            onClick={handleSubmit}
            disabled={selected === null}
          >
            Cevabi Kontrol Et
          </button>
        </div>
      ) : (
        <div className={`bq-result ${score === 1 ? "bq-result--correct" : "bq-result--wrong"}`}>
          <span className="bq-result__icon">{score === 1 ? "🎉" : "💡"}</span>
          <div className="bq-result__body">
            <p className="bq-result__verdict">
              {score === 1 ? "Dogru! Harika isin." : `Yanlis. Dogru cevap: "${options[correctIndex]}"`}
            </p>
            {explanation && <p className="bq-result__explanation">{explanation}</p>}
          </div>
          <button className="bq-reset" onClick={handleReset} aria-label="Tekrar dene">
            Tekrar
          </button>
        </div>
      )}
    </div>
  );
});

BlogQuiz.displayName = "BlogQuiz";
export default BlogQuiz;
