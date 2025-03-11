import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useWorkout } from "../contexts/WorkoutContext";
import backgroundImage from "../public/images/background.jpg";
interface AnswerButtonProps {
  text: string;
  onClick: () => void;
}
interface Question {
  title: string;
  subtitle: string;
  options: Array<{
    text: string;
    value: string;
    key?: string; // The property key to update in workoutData
  }>;
}
const questions: Question[] = [
  {
    title: "What gender do you identify with?",
    subtitle: "Just few quick questions to get you started",
    options: [
      { text: "Female", value: "female", key: "gender" },
      { text: "Male", value: "male", key: "gender" },
      { text: "Other", value: "other", key: "gender" },
      { text: "Prefer not to say", value: "not_specified", key: "gender" },
    ],
  },
  {
    title: "What's your primary fitness goal?",
    subtitle: "Great! Now let's know about your goals",
    options: [
      { text: "Lose Weight", value: "Lose Weight", key: "goal" },
      { text: "Build Muscle", value: "Build Muscle", key: "goal" },
      { text: "Get Stronger", value: "Get Stronger", key: "goal" },
      { text: "Stay Healthy", value: "Stay Healthy", key: "goal" },
    ],
  },
  {
    title: "What's your fitness level?",
    subtitle: "This helps us adjust your workout intensity",
    options: [
      { text: "Beginner", value: "beginner", key: "level" },
      { text: "Intermediate", value: "intermediate", key: "level" },
      { text: "Advanced", value: "advanced", key: "level" },
    ],
  },
  {
    title: "How long do you want your workout to be?",
    subtitle: "We'll customize your workout accordingly",
    options: [
      { text: "15 minutes", value: "15", key: "duration" },
      { text: "30 minutes", value: "30", key: "duration" },
      { text: "45 minutes", value: "45", key: "duration" },
      { text: "60 minutes", value: "60", key: "duration" },
    ],
  },
  {
    title: "What equipment do you have access to?",
    subtitle: "We'll customize your workout accordingly",
    options: [
      { text: "Full Gym", value: "full_gym", key: "equipment" },
      {
        text: "Basic Home Equipment",
        value: "basic_equipment",
        key: "equipment",
      },
      { text: "Bodyweight Only", value: "bodyweight", key: "equipment" },
    ],
  },
];
const AnswerButton = ({ text, onClick }: AnswerButtonProps) => (
  <button
    onClick={onClick}
    className="mt-8 px-30 py-8 bg-black/20 font-semibold rounded-3xl 
    hover:bg-black/90 hover:scale-105 transition-all duration-200 
    text-xl w-96 
    shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
  >
    {text}
  </button>
);

export const GetStarted = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { updateWorkoutData } = useWorkout();

  const handleAnswer = (answer: string, key: string) => {
    updateWorkoutData({ [key]: answer });

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      navigate("/training-program");
    }
    console.log(`Selected ${key}: ${answer}`);
  };

  const renderStep = () => {
    const currentQuestion = questions[step - 1];

    return (
      <>
        <p className="mt-48 text-lg font-semibold text-gray-300">
          {currentQuestion.subtitle}
        </p>
        <p className="mt-4 text-3xl font-semibold">{currentQuestion.title}</p>
        <div className="flex flex-col items-center mt-10">
          {currentQuestion.options.map((option) => (
            <AnswerButton
              key={option.value}
              text={option.text}
              onClick={() => handleAnswer(option.value, option.key!)}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-center relative animate-fade-in"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <div className="flex flex-col items-center min-h-screen">
        {renderStep()}
      </div>
    </div>
  );
};
