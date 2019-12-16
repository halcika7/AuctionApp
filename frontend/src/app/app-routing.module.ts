import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./containers/about/about.component";
import { NotFoundComponent } from "./containers/not-found/not-found.component";
import { PrivacyComponent } from "./containers/privacy/privacy.component";
import { ConditionsComponent } from "./containers/conditions/conditions.component";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { AllCategoriesComponent } from "./containers/all-categories/all-categories.component";
import { ProductPageComponent } from "./product-page/product-page.component";
import { ShopPageComponent } from "./shop-page/shop-page.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { ProfileComponent } from "./profile/profile.component";
import { ProfileSettingsComponent } from "./profile/profile-settings/profile-settings.component";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { SellerComponent } from "./profile/seller/seller.component";
import { WishlistComponent } from "./profile/wishlist/wishlist.component";
import { BidsComponent } from "./profile/bids/bids.component";
import { AddProductComponent } from './add-product/add-product.component';

import { LoginGuard } from "./auth/login.guard";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "home",
    children: [
      { path: "", component: LandingPageComponent },
      {
        path: "auth/login",
        component: LoginComponent,
        canActivate: [LoginGuard]
      },
      {
        path: "auth/register",
        component: RegisterComponent,
        canActivate: [LoginGuard]
      },
      {
        path: "auth/forgot-password",
        component: ForgotPasswordComponent,
        canActivate: [LoginGuard]
      },
      {
        path: "auth/forgot-password/:token",
        component: ForgotPasswordComponent,
        canActivate: [LoginGuard]
      },
      {
        path: "auth/reset-password",
        component: ResetPasswordComponent,
        canActivate: [LoginGuard]
      },
      {
        path: "categories",
        component: AllCategoriesComponent
      }
    ]
  },
  {
    path: "shop",
    children: [
      { path: "", component: ShopPageComponent },
      { path: ":categoryId/:subcategoryId", component: ShopPageComponent },
      { path: "about", component: AboutComponent },
      { path: "privacy", component: PrivacyComponent },
      { path: "terms", component: ConditionsComponent },
      { path: "products/:subcategoryId/:id", component: ProductPageComponent }
    ]
  },
  {
    path: "account",
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "profile",
        component: EditProfileComponent,
        canActivate: [AuthGuard]
      },
      { path: "seller", component: SellerComponent, canActivate: [AuthGuard] },
      { path: "bids", component: BidsComponent, canActivate: [AuthGuard] },
      {
        path: "wishlist",
        component: WishlistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "settings",
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "become-seller",
        component: AddProductComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: "top" })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
