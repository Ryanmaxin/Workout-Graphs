import { format, parseISO } from "date-fns";
import Papa from "papaparse";
import type {
  ExerciseProgression,
  ProcessedWorkoutData,
  WorkoutEntry,
} from "./types";

export function parseCSVData(csvText: string): WorkoutEntry[] {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value, field) => {
      if (
        field === "Set Order" ||
        field === "Weight" ||
        field === "Reps" ||
        field === "Distance" ||
        field === "Seconds"
      ) {
        return parseFloat(value) || 0;
      }
      return value;
    },
  });

  return result.data as WorkoutEntry[];
}

export async function loadWorkoutData(): Promise<WorkoutEntry[]> {
  try {
    // Use the correct base path for GitHub Pages deployment
    const basePath = import.meta.env.BASE_URL || "";
    const response = await fetch(`${basePath}strong.csv`);
    const csvText = await response.text();

    return parseCSVData(csvText);
  } catch (error) {
    console.error("Error loading workout data:", error);
    return [];
  }
}

export function calculate1RM(weight: number, reps: number): number {
  // Epley formula: 1RM = weight × (1 + reps/30)
  return weight * (1 + reps / 30);
}

export function processWorkoutData(
  entries: WorkoutEntry[]
): ProcessedWorkoutData[] {
  const processed: ProcessedWorkoutData[] = [];

  // Group by date, workout, and exercise
  const grouped = new Map<string, WorkoutEntry[]>();

  entries.forEach((entry) => {
    const key = `${entry.Date}|${entry["Workout Name"]}|${entry["Exercise Name"]}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(entry);
  });

  // Process each group
  grouped.forEach((sets, key) => {
    const [dateStr, workoutName, exerciseName] = key.split("|");
    const date = parseISO(dateStr);

    const maxWeight = Math.max(...sets.map((s) => s.Weight));
    const totalVolume = sets.reduce((sum, s) => sum + s.Weight * s.Reps, 0);
    const avgReps = sets.reduce((sum, s) => sum + s.Reps, 0) / sets.length;

    // Calculate estimated 1RM for each set and take the maximum
    const estimated1RM = Math.max(
      ...sets.map((s) => calculate1RM(s.Weight, s.Reps))
    );

    processed.push({
      date,
      workoutName,
      exerciseName,
      maxWeight,
      totalVolume,
      avgReps,
      sets: sets.length,
      estimated1RM,
    });
  });

  return processed.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getWorkoutTypes(entries: WorkoutEntry[]): string[] {
  const workoutTypes = new Set(entries.map((entry) => entry["Workout Name"]));
  return Array.from(workoutTypes).sort();
}

export function getExercises(entries: WorkoutEntry[]): string[] {
  const exercises = new Set(entries.map((entry) => entry["Exercise Name"]));

  // Count sessions for each exercise
  const exerciseSessionCounts = new Map<string, number>();
  exercises.forEach((exercise) => {
    const sessions = entries.filter(
      (entry) => entry["Exercise Name"] === exercise
    );
    exerciseSessionCounts.set(exercise, sessions.length);
  });

  // Sort by session count (descending) then alphabetically
  return Array.from(exercises).sort((a, b) => {
    const countA = exerciseSessionCounts.get(a) || 0;
    const countB = exerciseSessionCounts.get(b) || 0;

    if (countA !== countB) {
      return countB - countA; // Most sessions first
    }
    return a.localeCompare(b); // Alphabetical tiebreaker
  });
}

export function getExerciseProgression(
  processedData: ProcessedWorkoutData[],
  exerciseName: string
): ExerciseProgression {
  const exerciseData = processedData
    .filter((entry) => entry.exerciseName === exerciseName)
    .map((entry) => ({
      date: entry.date,
      maxWeight: entry.maxWeight,
      totalVolume: entry.totalVolume,
      avgReps: entry.avgReps,
      sets: entry.sets,
      estimated1RM: entry.estimated1RM,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    exerciseName,
    data: exerciseData,
  };
}

export function formatDate(date: Date): string {
  return format(date, "MMM dd, yyyy");
}

export function formatDuration(duration: string): string {
  return duration;
}
