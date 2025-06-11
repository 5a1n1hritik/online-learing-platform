import React from "react";

import noice from "../assets/globe-showing.svg";

const AnimatedScene = () => {
  const randomDelay = () => `${Math.random() * 5}s`;

  const balloonColors = [
    "from-red-400 to-red-500",
    "from-green-400 to-green-500",
    "from-blue-400 to-blue-500",
    "from-yellow-400 to-yellow-500",
    "from-purple-400 to-purple-500",
  ];

  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Globe Animation */}
        <div className="absolute top-20 right-10 w-32 h-32 opacity-10 dark:opacity-5 animate-spin-slow">
          <div className="w-full h-full rounded-full border-4 border-dashed border-blue-400 relative">
            <div className="absolute inset-2 rounded-full border-2 border-blue-300">
              <div className="absolute inset-2 rounded-full border border-blue-200">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-30 w-32 h-32 opacity-40 dark:opacity-20 animate-spin-slow">
          <div className="w-full h-full rounded-full border-4 border-dashed border-blue-400 relative">
            <div className="absolute inset-2 rounded-full border-2 border-blue-300">
              <div className="absolute inset-2 rounded-full border border-blue-200">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-20 left-20 w-32 h-42 opacity-10 dark:opacity-5 animate-spin-slow">
          <div className="w-full h-full rounded-full border-4 border-dashed border-blue-400 relative">
            <div className="absolute inset-2 rounded-full border-2 border-blue-300">
              <div className="absolute inset-2 rounded-full border border-blue-200">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Globe */}
        <div
          className="absolute bottom-32 right-24 w-24 h-24 opacity-8 dark:opacity-4 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "12s" }}
        >
          <div className="w-full h-full rounded-full border-3 border-dashed border-purple-400 relative">
            <div className="absolute inset-1 rounded-full border border-purple-300">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-32 left-16 w-24 h-4 opacity-8 dark:opacity-4 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "12s" }}
        >
          <div className="w-full h-full rounded-full border-3 border-dashed border-purple-400 relative">
            <div className="absolute inset-1 rounded-full border border-purple-300">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-32 left-16 w-24 h-4 opacity-8 dark:opacity-4 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "6s" }}
        >
          <div className="w-full h-full rounded-full border-3 border-dashed border-purple-400 relative">
            <div className="absolute inset-1 rounded-full border border-purple-300">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Floating Balloons */}
        <div className="absolute top-40 left-20 animate-float opacity-15 dark:opacity-8">
          <div className="relative">
            <div className="w-8 h-10 bg-gradient-to-b from-red-400 to-red-500 rounded-full"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-400"></div>
          </div>
        </div>

        <div
          className="absolute top-60 right-32 animate-float opacity-15 dark:opacity-8"
          style={{ animationDelay: "1s" }}
        >
          <div className="relative">
            <div className="w-6 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-12 bg-gray-400"></div>
          </div>
        </div>

        <div
          className="absolute bottom-40 right-20 animate-float opacity-15 dark:opacity-8"
          style={{ animationDelay: "2s" }}
        >
          <div className="relative">
            <div className="w-7 h-9 bg-gradient-to-b from-green-400 to-green-500 rounded-full"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-14 bg-gray-400"></div>
          </div>
        </div>

        <div
          className="absolute top-80 left-1/3 animate-float opacity-15 dark:opacity-8"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="relative">
            <div className="w-5 h-7 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-10 bg-gray-400"></div>
          </div>
        </div>

        <div
          className="absolute bottom-60 left-1/4 animate-float opacity-15 dark:opacity-8"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="relative">
            <div className="w-6 h-8 bg-gradient-to-b from-purple-400 to-purple-500 rounded-full"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-12 bg-gray-400"></div>
          </div>
        </div>

        {/* Floating Particles */}
        <div
          className="absolute top-1/4 left-1/2 w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-green-300 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "2.5s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
        ></div>

        {/* Gradient Orbs */}
        <div className="absolute top-32 right-1/4 w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10 dark:opacity-5 animate-pulse-soft"></div>
        <div
          className="absolute bottom-48 left-1/3 w-16 h-16 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-10 dark:opacity-5 animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Constellation Effect */}
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute top-1/2 left-1/4 translate-x-8 translate-y-4 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 translate-x-4 translate-y-8 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Connecting lines for constellation */}
        <div className="absolute top-1/2 left-1/4 w-8 h-px bg-gradient-to-r from-blue-400 to-transparent opacity-20 transform rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 translate-x-4 translate-y-4 w-6 h-px bg-gradient-to-r from-blue-400 to-transparent opacity-20 transform rotate-45"></div>

        {/* <div className={`absolute inset-0 bg-${noice}] opacity-5 pointer-events-none z-0`} /> */}

        {/* Animated globe */}
        <div className="absolute top-16 right-16 w-40 h-40 opacity-10 animate-spin-slow z-10">
          <img
            src={noice}
            alt="Spinning Globe"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Glowing particles */}
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={`particle-${index}`}
            className="absolute bg-white rounded-full opacity-10 blur-sm animate-pulse-soft z-10"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: randomDelay(),
            }}
          />
        ))}

        {/* Floating balloons */}
        {Array.from({ length: 5 }).map((_, index) => {
          const color = balloonColors[index % balloonColors.length];
          return (
            <div
              key={`balloon-${index}`}
              className={`absolute w-8 h-10 rounded-full shadow-xl ring-2 ring-white/10 hover:scale-110 transition-transform duration-300 z-10 bg-gradient-to-b ${color} animate-float opacity-15 dark:opacity-8`}
              style={{
                top: `${Math.random() * 80 + 5}%`,
                left: `${Math.random() * 90 + 5}%`,
                animationDelay: randomDelay(),
                transform: `translateX(${Math.random() * 10 - 5}px)`,
              }}
            />
          );
        })}

        {/* Background stars */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-blue-300 rounded-full opacity-30 blur-[1px]"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AnimatedScene;
