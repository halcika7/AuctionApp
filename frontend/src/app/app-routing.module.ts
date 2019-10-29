import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './containers/about/about.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { PrivacyComponent } from './containers/privacy/privacy.component';
import { ConditionsComponent } from './containers/conditions/conditions.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    children: [
      { path: '', component: LandingPageComponent },
      {
        path: 'auth/login',
        component: LoginComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'auth/register',
        component: RegisterComponent,
        canActivate: [LoginGuard]
      }
    ]
  },
  {
    path: 'shop',
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'terms', component: ConditionsComponent }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
