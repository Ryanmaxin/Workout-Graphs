export interface WorkoutEntry {
  date: string;
  workoutName: string;
  duration: string;
  exerciseName: string;
  setOrder: number;
  weight: number;
  reps: number;
  distance: number;
  seconds: number;
  rpe: string;
}

export interface ProcessedWorkoutData {
  date: Date;
  workoutName: string;
  exerciseName: string;
  maxWeight: number;
  totalVolume: number;
  avgReps: number;
  sets: number;
}

export interface ExerciseProgression {
  exerciseName: string;
  data: {
    date: Date;
    maxWeight: number;
    totalVolume: number;
    avgReps: number;
    sets: number;
  }[];
}
