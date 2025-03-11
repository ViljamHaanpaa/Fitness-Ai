import "../App.css";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
export const Home = () => {
  const [isFadeIn, setIsFadeIn] = useState(true);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setIsFadeIn(false); // Trigger fade out
    setTimeout(() => {
      navigate("/get-started");
    }, 700); // Match this with your animation duration
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${
        isFadeIn ? "animate-fade-in" : "animate-fade-out"
      }`}
    >
      <h1 className="text-8xl font-black text-gray-200 drop-shadow-[0_0_0.3rem_#ffffff70] mt-48">
        Fitness AI
      </h1>
      <p className="mt-4 text-lg font-semibold text-gray-300">
        🔥 Meet FitnessAi – The Ultimate AI Personal Trainer! 🔥
      </p>
      <button
        onClick={handleGetStarted}
        className="mt-40 px-20 py-5 bg-gray-900 font-semibold rounded-md hover:bg-blue-700 transition text-lg"
      >
        Get Started 💪
      </button>
    </div>
  );
};
