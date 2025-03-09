import { useState, useEffect } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import { generateWorkoutPlan } from "../assets/services/ai/deepseek";
import { Card, CardContent } from "../components/ui/card";
import { Loader } from "lucide-react";
import backgroundImage from "../public/images/background.jpg";
export const TrainingProgram = () => {
  const { workoutData } = useWorkout();
  const [plan, setPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (!isLoading) {
      // Start fade out animation when loading completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Match this with your animation duration
      return () => clearTimeout(timer);
    }
    setIsVisible(true);
  }, [isLoading]);
  useEffect(() => {
    let MAX_RETRIES = 3;
    console.log("Generating plan...", workoutData);
    const generatePlan = async () => {
      if (!workoutData.goal || !workoutData.level) return;
      setIsLoading(true);
      for (let i = 0; i < MAX_RETRIES; i++) {
        const generatedPlan = await generateWorkoutPlan(workoutData);

        if (generatedPlan) {
          console.log("Generated plan:", generatedPlan);
          setPlan(generatedPlan);
          setIsLoading(false);
          return;
        } else {
          console.error(`Attempt ${i + 1} failed. Retrying...`);
        }
      }

      console.error("Failed to generate workout plan after multiple attempts.");
      setIsLoading(false);
    };
    generatePlan();
  }, [workoutData]);

  if (!plan && !isLoading) return null;

  return (
    <div
      className="min-h-screen bg-fixed bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <div className="min-h-screen">
        {isLoading || isVisible ? (
          <div
            className={`flex justify-center items-center h-screen text-center text-gray-200 
          ${!isLoading ? "animate-fade-out" : "animate-fade-in"}`}
          >
            <Loader className="animate-spin text-gray-200" size={32} />
            <p className="ml-4 text-3xl">Generating your workout plan...</p>
          </div>
        ) : (
          <div className="container mx-auto p-4 max-w-3xl animate-fade-in">
            <h1 className="text-6xl font-black text-gray-200 drop-shadow-[0_0_0.3rem_#ffffff70] text-center mb-8">
              Your Training Program
            </h1>
            <Card className="p-4 rounded-2xl shadow-lg bg-black/70  text-gray-200 border-0">
              <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
              <p className="text-gray-300">
                Total Duration: {plan.duration} mins
              </p>
            </Card>
            {/* Sections remain the same structure, just updated colors */}
            <Section title="Warmup" duration={plan.warmup?.duration}>
              {plan.warmup?.exercises.map((exercise: any, index: number) => (
                <ExerciseCard
                  key={index}
                  name={exercise.name}
                  duration={exercise.duration}
                  description={exercise.description}
                />
              ))}
            </Section>
            <Section title="Main Workout" duration={plan.mainWorkout?.duration}>
              {plan.mainWorkout?.exercises.map(
                (exercise: any, index: number) => (
                  <ExerciseCard
                    key={index}
                    name={exercise.name}
                    sets={exercise.sets}
                    reps={exercise.reps}
                    rest={exercise.rest}
                    description={exercise.description}
                  />
                )
              )}
            </Section>
            <Section title="Cooldown" duration={plan.cooldown?.duration}>
              {plan.cooldown?.stretches.map((stretch: any, index: number) => (
                <ExerciseCard
                  key={index}
                  name={stretch.name}
                  duration={stretch.duration}
                  description={stretch.description}
                />
              ))}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({
  title,
  duration,
  children,
}: {
  title: string;
  duration?: string;
  children: React.ReactNode;
}) => (
  <Card className="p-6 mt-8 bg-black/70 text-gray-200 rounded-2xl transition border-0 shadow-xl">
    <h3 className="text-3xl font-bold mb-2">{title}</h3>
    {duration && <p className="text-md text-gray-300 mb-4">{duration} mins</p>}
    <div className="mt-4 space-y-4">{children}</div>
  </Card>
);

// Update ExerciseCard component
const ExerciseCard = ({
  name,
  duration,
  sets,
  reps,
  rest,
  description,
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log("ExerciseCard", description);
  return (
    <CardContent
      className={`p-5 bg-black/60 rounded-2xl hover:bg-black/90 transition shadow-md cursor-pointer
        ${isExpanded ? "border-l-4 border-blue-500" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold text-gray-200 mb-2">{name}</p>
        <svg
          className={`w-6 h-6 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <div className="space-y-2">
        {duration && (
          <p className="text-xl text-gray-300">Duration: {duration}</p>
        )}
        {sets && reps && (
          <p className="text-md text-gray-300">
            Sets: {sets} | Reps: {reps}
          </p>
        )}
        {rest && <p className="text-md text-gray-400">Rest: {rest}</p>}

        {/* Description that slides down when expanded */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? "max-h-24 mt-4 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <p className="text-gray-300 text-md italic border-t border-gray-700 pt-4">
            {description || "No description available."}
          </p>
        </div>
      </div>
    </CardContent>
  );
};
