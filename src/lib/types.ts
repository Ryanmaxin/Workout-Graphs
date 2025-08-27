export interface WorkoutEntry {
  Date: string;
  "Workout Name": string;
  Duration: string;
  "Exercise Name": string;
  "Set Order": number;
  Weight: number;
  Reps: number;
  Distance: number;
  Seconds: number;
  RPE: string;
}

export interface ProcessedWorkoutData {
  date: Date;
  workoutName: string;
  exerciseName: string;
  maxWeight: number;
  totalVolume: number;
  avgReps: number;
  sets: number;
  estimated1RM: number;
}

export interface ExerciseProgression {
  exerciseName: string;
  data: {
    date: Date;
    maxWeight: number;
    totalVolume: number;
    avgReps: number;
    sets: number;
    estimated1RM: number;
  }[];
}
