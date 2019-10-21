import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AboutComponent } from './containers/about/about.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { PrivacyComponent } from './containers/privacy/privacy.component';
import { ConditionsComponent } from './containers/conditions/conditions.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './home/landing-page/landing-page.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'landing', component: LandingPageComponent },
      {
        path: 'auth/:type',
        component: AuthComponent
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
  { path: 'account', component: HomeComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
