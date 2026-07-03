import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { KeycloakService } from "keycloak-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { initializeKeycloak } from "./auth/keycloak.init";
import { AboutComponent } from "./components/about/about.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { DeliveryComponent } from "./components/delivery/delivery.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ForumComponent } from "./components/forum/forum.component";
import { HomeComponent } from "./components/home/home.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ReviewsComponent } from "./components/reviews/reviews.component";
import { ShopComponent } from "./components/shop/shop.component";
import { LogsComponent } from "./components/logs/logs.component";
import { OrderService } from "./services/order.service";
import { CommonModule } from "@angular/common";
import { ProductDetailComponent } from "./components/product-details/product-detail.component";
import { AuthRedirectService } from "./auth/auth.redirect";
import { NutritionProfileComponent } from "./components/nutrition-profile/nutrition-profile.component";
import { MealPlanComponent } from "./components/meal-plan/meal-plan.component";


@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    AboutComponent,
    CartComponent,
    CheckoutComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ForumComponent,
    ReviewsComponent,
    DeliveryComponent,
    ProductDetailComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
     HttpClientModule,
     CommonModule,
     NutritionProfileComponent,
     MealPlanComponent
    
  ],
   providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    OrderService,
    AuthRedirectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
