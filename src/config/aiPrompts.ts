export const WORKOUT_PROMPT = `Return only a JSON object with NO additional text, NO markdown, NO explanations.

Strict JSON Formatting Rules:
- Use ONLY double quotes for all keys and string values.
- Do NOT include trailing commas.
- Ensure all numeric values (e.g., sets) are valid numbers.
- Ensure all string values (e.g., durations) follow the format ("30s", "2min").
-"You MUST use only double quotes (\") for all JSON properties and values. Do NOT use single quotes (')."
-"You MUST enclose all string values in double quotes (\"). Do NOT return any unquoted strings."


The JSON should match the exact structure below:

{
  "title": "{goal} Workout - {level} Level",
  "duration": "{duration}",
  "gender": "{gender}",
  "equipment": "{equipment}",
  "warmup": {
    "duration": "{warmupTime}",
    "exercises": [
      {
        "name": "exercise1",
        "duration": "2min",
        "description": "Perform a simple warm-up exercise to prepare your body for training."
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
        "description": "Maintain proper form. Engage your core while performing this movement."
      }
    ]
  },
  "cooldown": {
    "duration": "{cooldownTime}",
    "stretches": [
      {
        "name": "stretch1",
        "duration": "30s",
         "description": "Hold this stretch to relax the muscles and improve flexibility."
      }
    ]
  }
}`;

export const formatWorkoutResponse = (response: string) => {
  try {
    // STEP 1: Remove markdown artifacts and trim
    let cleanJson = response
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();

    // STEP 2: Extract JSON block
    const jsonStart = cleanJson.indexOf("{");
    const jsonEnd = cleanJson.lastIndexOf("}") + 1;
    cleanJson = cleanJson.slice(jsonStart, jsonEnd);

    // STEP 3: Fix all quote issues
    cleanJson = cleanJson
      .replace(/[“”„]/g, '"') // Curly double quotes to straight
      .replace(/[‘’]/g, "'") // Curly single quotes to straight single
      .replace(/'([^']*)'/g, '"$1"'); // Single to double quotes in values

    // STEP 4: Fix missing quotes around keys (e.g., name: -> "name":)
    cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    // STEP 5: Fix unquoted values like 60s, by wrapping in double quotes
    cleanJson = cleanJson.replace(/:\s*([0-9]+s)(\s*[},])/g, ':"$1"$2');

    // STEP 6: Remove newlines inside key-value pairs and replace with space to avoid broken strings
    cleanJson = cleanJson.replace(/:\s*"([^"]*)\n([^"]*)"/g, ':"$1 $2"');

    // STEP 7: Fix double double quotes ""value"" to "value"
    cleanJson = cleanJson.replace(/""([^""]*)""/g, '"$1"');

    // STEP 8: Fix extra commas before closing brackets
    cleanJson = cleanJson.replace(/,(\s*[}\]])/g, "$1");

    cleanJson = cleanJson.replace(/](\s*")/g, "],$1");

    // Debug before parsing
    console.log("Cleaned JSON:", cleanJson);

    // STEP 9: Parse JSON
    const parsedJson = JSON.parse(cleanJson);

    // STEP 10: Format structured response
    const formattedPlan = {
      title: parsedJson.title || "",
      duration: parsedJson.duration || "60",
      gender: parsedJson.gender || "unknown",
      warmup: {
        duration: parsedJson.warmup?.duration || "10",
        exercises: (parsedJson.warmup?.exercises || []).map((ex: any) => ({
          name: ex.name || "Warmup Exercise",
          duration: ex.duration || "2min",
          description: ex.description || `Perform ${ex.name || "exercise"}`,
        })),
      },
      mainWorkout: {
        duration: parsedJson.mainWorkout?.duration || "40",
        exercises: (parsedJson.mainWorkout?.exercises || []).map((ex: any) => ({
          name: ex.name || "Exercise",
          sets: Number(ex.sets) || 3,
          reps: ex.reps || "8-12",
          rest: ex.rest || "60s",
          description:
            ex.description ||
            `Perform ${ex.name || "exercise"} with proper form`,
        })),
      },
      cooldown: {
        duration: parsedJson.cooldown?.duration || "10",
        stretches: (parsedJson.cooldown?.stretches || []).map(
          (stretch: any) => ({
            name: stretch.name || "Stretch",
            duration: stretch.duration || "30s",
            description:
              stretch.description || `Hold ${stretch.name || "stretch"}`,
          })
        ),
      },
    };

    return formattedPlan;
  } catch (error) {
    console.error("Failed to parse workout JSON:", error);
    console.log("Raw response:", response);
    throw error;
  }
};
