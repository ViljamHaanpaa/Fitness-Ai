import type { WorkoutData } from "../../../contexts/WorkoutContext";

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
            content:
              "You are a professional fitness trainer creating personalized workout plans.",
          },
          {
            role: "user",
            content: `Generate a detailed workout plan using this data:
              - Gender: ${workoutData.gender}
              - Goal: ${workoutData.goal}
              - Level: ${workoutData.level}
              - Duration: ${workoutData.duration} minutes
              - Available Equipment: ${workoutData.equipment.join(", ")}
              
              Please provide:
              1. Warm-up exercises
              2. Main exercises with sets, reps, and rest periods
              3. Cool-down exercises
              4. Total workout duration`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate workout plan");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw error;
  }
};
