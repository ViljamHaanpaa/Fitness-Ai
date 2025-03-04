export const WORKOUT_PROMPT = `Return only a JSON object with NO additional text, NO markdown, NO explanations. 
The JSON **MUST**:
- Use ONLY double quotes for keys and string values.
- Include correct commas between properties.
- NOT contain any extra text before or after the JSON.

Example format:
{
  "title": "{goal} Workout - {level} Level",
  "duration": "{duration}",
  "warmup": {
    "duration": "{warmupTime}",
    "exercises": [
      {
        "name": "exercise1",
        "duration": "2min",
      }
    ]
  },
  "mainWorkout": {
    "duration": "{mainTime}",
    "exercises": [
      {
        "name": "exercise1",
        "sets": 3,
        "reps": "8-12",
        "rest": "60s",
      }
    ]
  },
  "cooldown": {
    "duration": "{cooldownTime}",
    "stretches": [
      {
        "name": "stretch1",
        "duration": "30s",
      }
    ]
  }
}`;

export const formatWorkoutResponse = (response: string) => {
  try {
    // Remove markdown and clean the response
    let cleanJson = response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Find the JSON object boundaries
    const jsonStart = cleanJson.indexOf("{");
    const jsonEnd = cleanJson.lastIndexOf("}") + 1;
    cleanJson = cleanJson.slice(jsonStart, jsonEnd);

    // Fix common JSON formatting issues
    cleanJson = cleanJson
      // Quote all property names
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
      // Quote string values
      .replace(/:\s*'([^']+)'/g, ':"$1"')
      // Fix unquoted string values
      .replace(/:\s*([^",{\[\]}\s][^,}\]]*)/g, ':"$1"')
      // Fix spaces in time values
      .replace(/:\s*"(\d+)\s*s"/g, ':"$1s"')
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, "$1");

    const parsedJson = JSON.parse(cleanJson);

    // Format the response structure
    const formattedPlan = {
      title: parsedJson.title || "",
      duration: parsedJson.duration || "60",
      warmup: {
        duration: parsedJson.warmup?.duration || "10",
        exercises: (parsedJson.warmup?.exercises || []).map((ex: any) => ({
          name: ex.name || "Warmup Exercise",
          duration: ex.duration || "2min",
          description: ex.description || `Perform ${ex.name}`,
        })),
      },
      mainWorkout: {
        duration: parsedJson.mainWorkout?.duration || "40",
        exercises: (parsedJson.mainWorkout?.exercises || []).map((ex: any) => ({
          name: ex.name || "Exercise",
          sets: Number(ex.sets) || 3,
          reps: ex.reps || "8-12",
          rest: ex.rest || "60s",
          description: ex.description || `Perform ${ex.name} with proper form`,
        })),
      },
      cooldown: {
        duration: parsedJson.cooldown?.duration || "10",
        stretches: (parsedJson.cooldown?.stretches || []).map(
          (stretch: any) => ({
            name: stretch.name || "Stretch",
            duration: stretch.duration || "30s",
            description: stretch.description || `Hold ${stretch.name} stretch`,
          })
        ),
      },
    };

    return formattedPlan;
  } catch (error) {
    console.error("Failed to parse workout JSON:", error);
    console.log("Raw response:", response);
    return null;
  }
};
