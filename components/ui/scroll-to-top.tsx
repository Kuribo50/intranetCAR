"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white" style={{ backgroundColor: '#0075F2' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056CC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0075F2'}
      aria-label="Volver al inicio"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
