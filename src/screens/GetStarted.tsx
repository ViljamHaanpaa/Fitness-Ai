import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useWorkout } from "../contexts/WorkoutContext";

interface AnswerButtonProps {
  text: string;
  onClick: () => void;
}

const AnswerButton = ({ text, onClick }: AnswerButtonProps) => (
  <button
    onClick={onClick}
    className="mt-4 px-16 py-4 bg-gray-900 font-semibold rounded-md hover:bg-blue-700 transition text-lg w-64"
  >
    {text}
  </button>
);

export const GetStarted = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { updateWorkoutData } = useWorkout();
  const handleAnswer = (answer: string) => {
    if (step === 1) {
      updateWorkoutData({ gender: answer });
      setStep(2);
    } else if (step === 2) {
      updateWorkoutData({
        goal: answer,
        level: "intermediate",
        duration: 60,
      });
      navigate("/training-program");
    }
    console.log(`Selected: ${answer}`);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <p className="mt-48 text-lg font-semibold text-gray-300">
              Just few quick questions to get you started
            </p>
            <p className="mt-4 text-3xl font-semibold">
              What gender do you identify with?
            </p>
            <div className="flex flex-col items-center mt-10">
              <AnswerButton
                text="Female"
                onClick={() => handleAnswer("female")}
              />
              <AnswerButton text="Male" onClick={() => handleAnswer("male")} />
              <AnswerButton
                text="Other"
                onClick={() => handleAnswer("other")}
              />
              <AnswerButton
                text="Prefer not to say"
                onClick={() => handleAnswer("not_specified")}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p className="mt-48 text-lg font-semibold text-gray-300">
              Great! Now let's know about your goals
            </p>
            <p className="mt-4 text-3xl font-semibold">
              What's your primary fitness goal?
            </p>
            <div className="flex flex-col items-center mt-10">
              <AnswerButton
                text="Lose Weight"
                onClick={() => handleAnswer("Lose Weight")}
              />
              <AnswerButton
                text="Build Muscle"
                onClick={() => handleAnswer("Build Muscle")}
              />
              <AnswerButton
                text="Get Stronger"
                onClick={() => handleAnswer("Get Stronger")}
              />
              <AnswerButton
                text="Stay Healthy"
                onClick={() => handleAnswer("Stay Healthy")}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {renderStep()}
    </div>
  );
};
