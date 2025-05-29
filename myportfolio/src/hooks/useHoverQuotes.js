// src/hooks/useHoverQuotes.js
import { useState, useEffect, useCallback, useRef } from "react";

const useHoverQuotes = (targetRef, quotes, options = {}) => {
  // ... (önceki gibi tam kod) ...
  const { delay = 0, hideDelay = 100 } = options;
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const getRandomQuote = useCallback(() => {
    if (!quotes || quotes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, [quotes]);

  useEffect(() => {
    const element = targetRef.current;
    if (!element || !quotes || quotes.length === 0) return;

    const handleMouseEnter = () => {
      clearTimeout(hideTimeoutRef.current);
      showTimeoutRef.current = setTimeout(() => {
        const newQuote = getRandomQuote();
        setCurrentQuote(newQuote);
        setIsQuoteVisible(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      clearTimeout(showTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsQuoteVisible(false);
      }, hideDelay);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
      if (element) {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [targetRef, quotes, delay, hideDelay, getRandomQuote]);

  return { currentQuote, isQuoteVisible };
};

export default useHoverQuotes;
