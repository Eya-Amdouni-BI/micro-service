import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ShopComponent } from './components/shop/shop.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { ForumComponent } from './components/forum/forum.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { LogsComponent } from './components/logs/logs.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { ProductDetailComponent } from './components/product-details/product-detail.component';
import { adminGuard } from './auth/admin.guard';
import { AdminDashboardComponent,  } from './admin/dashboard/dashboard.component';
import { NutritionProfileComponent } from './components/nutrition-profile/nutrition-profile.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'logs', component: LogsComponent, canActivate: [adminGuard] },
    { path: 'orders', component: MyOrdersComponent },
  { path: 'shop/:id', component: ProductDetailComponent },
  { path: 'nutrition-profile', component: NutritionProfileComponent },
  { path: 'meal-plans', component: MealPlanComponent },
  {path:'admin',component:AdminDashboardComponent, canActivate: [adminGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }