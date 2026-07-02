import React, { useState, useRef, useCallback, memo } from "react";
import { Trophy, Lightbulb, CheckCircle2, XCircle, RotateCcw, Check, Sparkles } from "lucide-react";
import "./Quiz.css";

const Quiz = memo(({ quizData }) => {
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
      <div className="qz-wrap" style={{ padding: "20px", color: "#ef4444" }}>
        Geçersiz quiz verisi. `question` ve `options` alanları zorunludur.
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
    let cls = "qz-option";
    if (selected === idx) cls += " qz-option--selected";
    if (submitted) {
      if (idx === correctIndex) cls += " qz-option--correct";
      else if (selected === idx) cls += " qz-option--wrong";
      else cls += " qz-option--neutral";
    }
    return cls;
  };

  return (
    <div className="qz-wrap" ref={questionRef} tabIndex={-1}>
      <div className="qz-header">
        <div className="qz-header-left">
          <Sparkles size={14} color="#3b82f6" />
          <span className="qz-badge">Bilgi Testi</span>
        </div>
        {hint && (
          <div className="qz-hint">
            <Lightbulb size={14} />
            <span>İpucu: {hint}</span>
          </div>
        )}
      </div>

      <p className="qz-question">{question}</p>

      <div className="qz-options" role="radiogroup" aria-label={question}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            role="radio"
            aria-checked={selected === idx}
            className={getOptionClass(idx)}
            onClick={() => handleSelect(idx)}
            disabled={submitted}
          >
            <span className="qz-option__marker">
              {submitted && idx === correctIndex ? (
                <CheckCircle2 size={16} />
              ) : submitted && idx !== correctIndex && selected === idx ? (
                <XCircle size={16} />
              ) : (
                String.fromCharCode(65 + idx)
              )}
            </span>
            <span className="qz-option__text">{opt}</span>
          </button>
        ))}
      </div>

      {!submitted ? (
        <div className="qz-actions">
          <button
            className="qz-submit"
            onClick={handleSubmit}
            disabled={selected === null}
          >
            <Check size={16} />
            Cevabı Kontrol Et
          </button>
        </div>
      ) : (
        <div className={`qz-result ${score === 1 ? "qz-result--correct" : "qz-result--wrong"}`}>
          <div className="qz-result-header">
            <div className="qz-result__icon">
              {score === 1 ? <Trophy size={20} /> : <Lightbulb size={20} />}
            </div>
            <div className="qz-result__body">
              <p className="qz-result__verdict">
                {score === 1 
                  ? "Doğru! Harika iş çıkardın." 
                  : `Yanlış. Doğru cevap: "${options[correctIndex]}"`
                }
              </p>
              {explanation && <p className="qz-result__explanation">{explanation}</p>}
            </div>
          </div>
          <button className="qz-reset" onClick={handleReset} aria-label="Tekrar dene">
            <RotateCcw size={14} />
            Tekrar Çöz
          </button>
        </div>
      )}
    </div>
  );
});

Quiz.displayName = "Quiz";
export default Quiz;
