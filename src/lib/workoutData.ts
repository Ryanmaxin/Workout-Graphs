import { format, parseISO } from "date-fns";
import Papa from "papaparse";
import type {
  ExerciseProgression,
  ProcessedWorkoutData,
  WorkoutEntry,
} from "./types";

export async function loadWorkoutData(): Promise<WorkoutEntry[]> {
  try {
    const response = await fetch("/strong.csv");
    const csvText = await response.text();

    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (
          field === "setOrder" ||
          field === "weight" ||
          field === "reps" ||
          field === "distance" ||
          field === "seconds"
        ) {
          return parseFloat(value) || 0;
        }
        return value;
      },
    });

    return result.data as WorkoutEntry[];
  } catch (error) {
    console.error("Error loading workout data:", error);
    return [];
  }
}

export function processWorkoutData(
  entries: WorkoutEntry[]
): ProcessedWorkoutData[] {
  const processed: ProcessedWorkoutData[] = [];

  // Group by date, workout, and exercise
  const grouped = new Map<string, WorkoutEntry[]>();

  entries.forEach((entry) => {
    const key = `${entry.date}|${entry.workoutName}|${entry.exerciseName}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(entry);
  });

  // Process each group
  grouped.forEach((sets, key) => {
    const [dateStr, workoutName, exerciseName] = key.split("|");
    const date = parseISO(dateStr);

    const maxWeight = Math.max(...sets.map((s) => s.weight));
    const totalVolume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
    const avgReps = sets.reduce((sum, s) => sum + s.reps, 0) / sets.length;

    processed.push({
      date,
      workoutName,
      exerciseName,
      maxWeight,
      totalVolume,
      avgReps,
      sets: sets.length,
    });
  });

  return processed.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getWorkoutTypes(entries: WorkoutEntry[]): string[] {
  const workoutTypes = new Set(entries.map((entry) => entry.workoutName));
  return Array.from(workoutTypes).sort();
}

export function getExercises(entries: WorkoutEntry[]): string[] {
  const exercises = new Set(entries.map((entry) => entry.exerciseName));
  return Array.from(exercises).sort();
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
