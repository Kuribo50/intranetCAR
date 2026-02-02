"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; // Velocidad en ms por carácter
  className?: string;
  onComplete?: () => void;
  delay?: number; // Delay inicial antes de empezar
}

export function Typewriter({ 
  text, 
  speed = 50, 
  className = "", 
  onComplete,
  delay = 500 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Delay inicial
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, isComplete, onComplete, hasStarted]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && hasStarted && (
        <span className="inline-block w-0.5 h-[1em] bg-current ml-1 animate-pulse" />
      )}
    </span>
  );
}
