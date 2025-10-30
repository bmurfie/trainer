export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface WorkoutTemplate {
  id: string;
  name:string;
  exercises: Exercise[];
}

export interface SetLog {
  id: number;
  weight: number;
  reps: number;

  rpe: number;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: number;
  date: string;
  name: string;
  logs: Record<string, ExerciseLog>;
}

export interface NutritionPlan {
  trainingDay: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  restDay: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface FoodLog {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ExerciseTip {
    tip: string;
    description: string;
}

export interface CatalogExercise {
    name: string;
    muscleGroup: string;
    equipment: string;
}

// FIX: Add GroundingSource and ChatMessage types for AI Coach feature
export interface GroundingSource {
    uri: string;
    title?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    sources?: GroundingSource[];
}
