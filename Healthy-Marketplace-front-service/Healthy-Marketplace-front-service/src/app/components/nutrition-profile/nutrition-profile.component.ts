import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DietService } from '../../services/diet.service';
import { NutritionProfile, Goal } from '../../models/diet.model';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-nutrition-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nutrition-profile.component.html',
  styleUrl: './nutrition-profile.component.css'
})
export class NutritionProfileComponent implements OnInit {
  profileForm: FormGroup;
  profiles: NutritionProfile[] = [];
  currentProfile: NutritionProfile | null = null;
  isEditing = false;
  goals = Object.values(Goal);
  activityLevels = ['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE'];

  constructor(
    private fb: FormBuilder,
    private dietService: DietService,
    private keycloakService: KeycloakService
  ) {
    this.profileForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      age: ['', [Validators.required, Validators.min(10), Validators.max(120)]],
      gender: ['', Validators.required],
      activityLevel: ['', Validators.required],
      goal: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfiles();
  }

  loadUserProfiles(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.dietService.getNutritionProfilesByUserId(userId).subscribe({
        next: (profiles) => {
          this.profiles = profiles;
          if (profiles.length > 0) {
            this.currentProfile = profiles[0];
          }
        },
        error: (error) => console.error('Error loading profiles:', error)
      });
    }
  }

  getCurrentUserId(): string | null {
    const token = this.keycloakService.getKeycloakInstance().tokenParsed;
    return token && token.sub ? token.sub : null;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const userId = this.getCurrentUserId();
      if (!userId) {
        alert('User not authenticated');
        return;
      }

      const formValue = this.profileForm.value;
      const profile: NutritionProfile = {
        ...formValue,
        userId: userId
      };

      if (this.isEditing && this.currentProfile) {
        this.dietService.updateNutritionProfile(this.currentProfile.id!, profile).subscribe({
          next: (updatedProfile) => {
            this.currentProfile = updatedProfile;
            this.loadUserProfiles();
            this.resetForm();
          },
          error: (error) => console.error('Error updating profile:', error)
        });
      } else {
        this.dietService.createNutritionProfile(profile).subscribe({
          next: (newProfile) => {
            this.profiles.push(newProfile);
            this.currentProfile = newProfile;
            this.resetForm();
          },
          error: (error) => console.error('Error creating profile:', error)
        });
      }
    }
  }

  editProfile(profile: NutritionProfile): void {
    this.currentProfile = profile;
    this.isEditing = true;
    this.profileForm.patchValue({
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      goal: profile.goal
    });
  }

  deleteProfile(id: number): void {
    if (confirm('Are you sure you want to delete this profile?')) {
      this.dietService.deleteNutritionProfile(id).subscribe({
        next: () => {
          this.profiles = this.profiles.filter(p => p.id !== id);
          if (this.currentProfile?.id === id) {
            this.currentProfile = null;
          }
        },
        error: (error) => console.error('Error deleting profile:', error)
      });
    }
  }

  resetForm(): void {
    this.profileForm.reset();
    this.isEditing = false;
  }

  selectProfile(profile: NutritionProfile): void {
    this.currentProfile = profile;
  }
}
