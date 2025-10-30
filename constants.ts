

import type { WorkoutTemplate, NutritionPlan, CatalogExercise } from './types';

export const UPPER_BODY_WORKOUT: WorkoutTemplate = {
  id: 'upper',
  name: 'Upper Body Day',
  exercises: [
    { name: 'Incline Barbell Press', sets: '3', reps: '6-10' },
    { name: 'Weighted Pull-Ups', sets: '3', reps: '6-10' },
    { name: 'Flat Dumbbell Press', sets: '3', reps: '8-12' },
    { name: 'T-Bar Row', sets: '3', reps: '8-12' },
    { name: 'Seated Dumbbell Shoulder Press', sets: '3', reps: '10-15' },
    { name: 'Side Lateral Raises', sets: '4', reps: '12-20' },
    { name: 'EZ Bar Skull Crushers', sets: '3', reps: '10-15' },
    { name: 'Incline Dumbbell Curls', sets: '3', reps: '10-15' },
  ]
};

export const LOWER_BODY_WORKOUT: WorkoutTemplate = {
  id: 'lower',
  name: 'Lower Body Day',
  exercises: [
    { name: 'Barbell Squats', sets: '3', reps: '6-10' },
    { name: 'Romanian Deadlifts', sets: '3', reps: '8-12' },
    { name: 'Leg Press', sets: '4', reps: '12-20' },
    { name: 'Lying Leg Curls', sets: '4', reps: '12-20' },
    { name: 'Walking Lunges', sets: '3', reps: '10-15 per leg' },
    { name: 'Standing Calf Raises', sets: '4', reps: '15-25' },
  ]
};

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [UPPER_BODY_WORKOUT, LOWER_BODY_WORKOUT];

export const NUTRITION_PLAN: NutritionPlan = {
  trainingDay: {
    calories: 3400,
    protein: 220,
    carbs: 400,
    fat: 100
  },
  restDay: {
    calories: 3000,
    protein: 220,
    carbs: 300,
    fat: 100
  }
};

const allExercisesWithDetails: CatalogExercise[] = [
    { name: 'Incline Barbell Press', muscleGroup: 'Chest', equipment: 'Barbell' },
    { name: 'Weighted Pull-Ups', muscleGroup: 'Back', equipment: 'Weighted Bodyweight' },
    { name: 'Flat Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbells' },
    { name: 'T-Bar Row', muscleGroup: 'Back', equipment: 'Machine' },
    { name: 'Seated Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'Dumbbells' },
    { name: 'Side Lateral Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbells' },
    { name: 'EZ Bar Skull Crushers', muscleGroup: 'Triceps', equipment: 'EZ Bar' },
    { name: 'Incline Dumbbell Curls', muscleGroup: 'Biceps', equipment: 'Dumbbells' },
    { name: 'Barbell Squats', muscleGroup: 'Legs', equipment: 'Barbell' },
    { name: 'Romanian Deadlifts', muscleGroup: 'Hamstrings', equipment: 'Barbell' },
    { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
    { name: 'Lying Leg Curls', muscleGroup: 'Hamstrings', equipment: 'Machine' },
    { name: 'Walking Lunges', muscleGroup: 'Legs', equipment: 'Dumbbells' },
    { name: 'Standing Calf Raises', muscleGroup: 'Calves', equipment: 'Machine' },
];

const uniqueExercisesMap = new Map<string, CatalogExercise>();
allExercisesWithDetails.forEach(ex => {
    if (!uniqueExercisesMap.has(ex.name)) {
        uniqueExercisesMap.set(ex.name, ex);
    }
});

export const EXERCISE_CATALOG: CatalogExercise[] = Array.from(uniqueExercisesMap.values()).sort((a, b) => a.name.localeCompare(b.name));