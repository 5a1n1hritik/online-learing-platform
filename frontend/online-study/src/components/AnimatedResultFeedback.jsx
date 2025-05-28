import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import happyAnimation from "@/assets/happy-Animation.json";
import sadAnimation from "@/assets/sad-Animation.json";

export function AnimatedResultFeedback({ passed, score, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (passed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [passed]);

  const getMessage = () => {
    if (score >= 90) return "Outstanding! You're a star!";
    if (score >= 80) return "Great job! Well done!";
    if (score >= 70) return "Good work! You passed!";
    if (score >= 60) return "Not bad, but you can do better!";
    return "Don't give up! Try again!";
  };

  return (
    <div className={cn("relative", className)}>
      {/* Confetti Effect */}
      {/* {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )} */}

      {/* Main Result Display */}
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 transition-all duration-1000 transform",
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}
      >
        {/* Animated Icon */}
        <div
          className={cn(
            "relative mb-4 transition-all duration-500",
            isVisible && "animate-pulse"
          )}
        >
          <Lottie
            animationData={passed ? happyAnimation : sadAnimation}
            loop={true}
            style={{ height: "100px", width: "100px" }}
          />
          {passed && (
            <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-ping" />
          )}
        </div>

        {/* Animated Score */}
        <div
          className={cn(
            "text-6xl font-bold mb-2 transition-all duration-1000",
            passed ? "text-green-500" : "text-red-500",
            isVisible && "animate-bounce"
          )}
        >
          {score}%
        </div>

        {/* Message */}
        <p
          className={cn(
            "text-lg font-medium text-center transition-all duration-1000 delay-500",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {getMessage()}
        </p>

        {/* Status Badge */}
        <div
          className={cn(
            "mt-4 px-4 py-2 rounded-full font-medium transition-all duration-1000 delay-700",
            passed
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {passed
            ? "🎉 Congratulations! You Passed!"
            : "💪 Keep Trying! You Can Do It!"}
        </div>
      </div>
    </div>
  );
}
