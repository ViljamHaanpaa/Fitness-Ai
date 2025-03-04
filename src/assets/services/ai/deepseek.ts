import type { WorkoutData } from "../../../contexts/WorkoutContext";
import {
  WORKOUT_PROMPT,
  formatWorkoutResponse,
} from "../../../config/aiPrompts";
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

const API_URL = "https://api.deepseek.com/v1/chat/completions";

export const generateWorkoutPlan = async (workoutData: WorkoutData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a gym fitness trainer.In main workout, exclude bodyweight trainings. Follow these JSON formatting rules strictly:
              1. ALL property names must be in double quotes: "name", "sets", "reps", "rest"
              2. ALL string values must be in double quotes: "Exercise Name", "90s", "8-12"
              3. Only numbers can be without quotes: sets: 4
              4. NO spaces in time values: "90s" not "90 s"
              5. NO spaces in rep ranges: "8-12" not "8 -12"
              6. NO single quotes
              7. NO trailing commas
              8. NO comments`,
          },
          {
            role: "user",
            content: WORKOUT_PROMPT.replace("{goal}", workoutData.goal)
              .replace("{level}", workoutData.level)
              .replace("{duration}", workoutData.duration.toString())
              .replace("{warmupTime}", "10")
              .replace("{mainTime}", "40")
              .replace("{cooldownTime}", "10"),
          },
        ],
        temperature: 0.6, // Balanced between consistency and variety
        max_tokens: 1200, // Increased for more detailed responses
        presence_penalty: 0.4, // Reduced to maintain JSON structure
        frequency_penalty: 0.35, // Slightly increased for exercise variety
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate workout plan");
    }

    const data = await response.json();
    const workoutPlan = formatWorkoutResponse(data.choices[0].message.content);

    if (!workoutPlan) {
      throw new Error("Invalid workout plan format");
    }

    return workoutPlan;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw error;
  }
};
