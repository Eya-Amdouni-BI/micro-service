import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DietService } from '../../services/diet.service';
import { ProductService } from '../../services/product.service';
import { MealPlan, MealType, NutritionProfile } from '../../models/diet.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-meal-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './meal-plan.component.html',
  styleUrl: './meal-plan.component.css'
})
export class MealPlanComponent implements OnInit {
  mealPlanForm: FormGroup;
  mealPlans: MealPlan[] = [];
  profiles: NutritionProfile[] = [];
  products: Product[] = [];
  selectedProfile: NutritionProfile | null = null;
  isEditing = false;
  mealTypes = Object.values(MealType);
  selectedProducts: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private dietService: DietService,
    private productService: ProductService
  ) {
    this.mealPlanForm = this.fb.group({
      mealType: ['', Validators.required],
      recommendedCalories: ['', [Validators.required, Validators.min(0)]],
      selectedProducts: [[]]
    });
  }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadProducts();
  }

  loadProfiles(): void {
    this.dietService.getAllNutritionProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        if (profiles.length > 0) {
          this.selectedProfile = profiles[0];
          this.loadMealPlans();
        }
      },
      error: (error) => console.error('Error loading profiles:', error)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadMealPlans(): void {
    if (this.selectedProfile?.id) {
      this.dietService.getMealPlansByProfileId(this.selectedProfile.id).subscribe({
        next: (mealPlans) => {
          this.mealPlans = mealPlans;
        },
        error: (error) => console.error('Error loading meal plans:', error)
      });
    }
  }

  onProfileChange(): void {
    this.loadMealPlans();
  }

  onSubmit(): void {
    if (this.mealPlanForm.valid && this.selectedProfile) {
      const formValue = this.mealPlanForm.value;
      const mealPlan: MealPlan = {
        mealType: formValue.mealType,
        recommendedCalories: formValue.recommendedCalories,
        recommendedProductsIds: this.selectedProducts.map(p => p.id!)
      };

      if (this.isEditing) {
        // For editing, we'd need the meal plan ID
        // This is simplified - in a real app you'd track the editing meal plan
      } else {
        this.dietService.createMealPlan(this.selectedProfile.id!, mealPlan).subscribe({
          next: (newMealPlan) => {
            this.mealPlans.push(newMealPlan);
            this.resetForm();
          },
          error: (error) => console.error('Error creating meal plan:', error)
        });
      }
    }
  }

  toggleProductSelection(product: Product): void {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  deleteMealPlan(id: number): void {
    if (confirm('Are you sure you want to delete this meal plan?')) {
      this.dietService.deleteMealPlan(id).subscribe({
        next: () => {
          this.mealPlans = this.mealPlans.filter(mp => mp.id !== id);
        },
        error: (error) => console.error('Error deleting meal plan:', error)
      });
    }
  }

  resetForm(): void {
    this.mealPlanForm.reset();
    this.selectedProducts = [];
    this.isEditing = false;
  }

  getMealTypeLabel(mealType: MealType): string {
    return mealType.replace('_', ' ');
  }
}
