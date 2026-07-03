import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NutritionProfile, MealPlan } from '../models/diet.model';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  private baseUrl = 'http://localhost:8888/api'; 

  constructor(private http: HttpClient) { }

  // Nutrition Profile endpoints
  getAllNutritionProfiles(): Observable<NutritionProfile[]> {
    return this.http.get<NutritionProfile[]>(`${this.baseUrl}/NutritionProfile`);
  }

  getNutritionProfileById(id: number): Observable<NutritionProfile> {
    return this.http.get<NutritionProfile>(`${this.baseUrl}/NutritionProfile/${id}`);
  }

  getNutritionProfilesByUserId(userId: string): Observable<NutritionProfile[]> {
    return this.http.get<NutritionProfile[]>(`${this.baseUrl}/NutritionProfile/user/${userId}`);
  }

  createNutritionProfile(profile: NutritionProfile): Observable<NutritionProfile> {
    return this.http.post<NutritionProfile>(`${this.baseUrl}/NutritionProfile`, profile);
  }

  updateNutritionProfile(id: number, profile: NutritionProfile): Observable<NutritionProfile> {
    return this.http.put<NutritionProfile>(`${this.baseUrl}/NutritionProfile/${id}`, profile);
  }

  deleteNutritionProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/NutritionProfile/${id}`);
  }

  // Meal Plan endpoints
  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.baseUrl}/MealPlan`);
  }

  getMealPlanById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.baseUrl}/MealPlan/${id}`);
  }

  getMealPlansByProfileId(profileId: number): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.baseUrl}/MealPlan/profile/${profileId}`);
  }

  createMealPlan(profileId: number, mealPlan: MealPlan): Observable<MealPlan> {
    const params = new HttpParams().set('profileId', profileId.toString());
    return this.http.post<MealPlan>(`${this.baseUrl}/MealPlan`, mealPlan, { params });
  }

  updateMealPlan(id: number, mealPlan: MealPlan): Observable<MealPlan> {
    return this.http.put<MealPlan>(`${this.baseUrl}/MealPlan/${id}`, mealPlan);
  }

  deleteMealPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/MealPlan/${id}`);
  }
}