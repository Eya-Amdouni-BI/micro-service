export interface NutritionProfile {
  id?: number;
  userId: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: Goal;
  dailyCalories?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  mealPlans?: MealPlan[];
}

export enum Goal {
  LOSE_WEIGHT = 'LOSE_WEIGHT',
  GAIN_WEIGHT = 'GAIN_WEIGHT',
  MAINTAIN = 'MAINTAIN'
}

export interface MealPlan {
  id?: number;
  nutritionProfile?: NutritionProfile;
  mealType: MealType;
  recommendedCalories: number;
  recommendedProductsIds: number[];
  createdAt?: string;
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
}