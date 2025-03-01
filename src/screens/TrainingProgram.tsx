import { useState, useEffect } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import { generateWorkoutPlan } from "../assets/services/ai/deepseek";
export const TrainingProgram = () => {
  const { workoutData } = useWorkout();
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const generatePlan = async () => {
      if (!workoutData.gender || !workoutData.goal) return;

      setIsLoading(true);
      try {
        const generatedPlan = await generateWorkoutPlan(workoutData);
        console.log("Generated plan:", generatedPlan);
        setPlan(generatedPlan);
      } catch (error) {
        console.error("Failed to generate plan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generatePlan();
  }, [workoutData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Training Program</h1>

      {isLoading ? (
        <div className="text-center">
          <p>Generating your workout plan...</p>
        </div>
      ) : (
        <div>
          {plan && (
            <div className="mt-4 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-white text-lg leading-relaxed">
                {plan}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
