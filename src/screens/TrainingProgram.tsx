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

  useEffect(() => {
    console.log("Generating plan...", workoutData);
    const generatePlan = async () => {
      if (!workoutData.goal || !workoutData.level) return;

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

  if (isLoading) {
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
        <div className="flex justify-center min-h-screen items-center text-center text-gray-200">
          <Loader className="animate-spin text-gray-600" size={32} />
          <p className="ml-4 text-3xl">Generating your workout plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) return null;

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
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-6xl font-black text-gray-200 drop-shadow-[0_0_0.3rem_#ffffff70] text-center mb-8">
          Your Training Program
        </h1>

        <Card className="p-4 rounded-2xl shadow-lg bg-black/70  text-gray-200 border-0">
          <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
          <p className="text-gray-300">Total Duration: {plan.duration} mins</p>
        </Card>

        {/* Sections remain the same structure, just updated colors */}
        <Section title="Warmup" duration={plan.warmup?.duration}>
          {plan.warmup?.exercises.map((exercise: any, index: number) => (
            <ExerciseCard
              key={index}
              name={exercise.name}
              duration={exercise.duration}
            />
          ))}
        </Section>

        <Section title="Main Workout" duration={plan.mainWorkout?.duration}>
          {plan.mainWorkout?.exercises.map((exercise: any, index: number) => (
            <ExerciseCard
              key={index}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              rest={exercise.rest}
            />
          ))}
        </Section>

        <Section title="Cooldown" duration={plan.cooldown?.duration}>
          {plan.cooldown?.stretches.map((stretch: any, index: number) => (
            <ExerciseCard
              key={index}
              name={stretch.name}
              duration={stretch.duration}
            />
          ))}
        </Section>
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
const ExerciseCard = ({ name, duration, sets, reps, rest }: any) => (
  <CardContent className="p-5 bg-black/60  rounded-2xl hover:bg-black/90  transition shadow-md">
    <p className="text-2xl font-semibold text-gray-200 mb-2">{name}</p>
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
    </div>
  </CardContent>
);
