import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Font Awesome Icons
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faFacebookF,
  faFacebookSquare,
  faInstagram,
  faTwitter,
  faGooglePlusSquare,
  faGooglePlusG
} from '@fortawesome/free-brands-svg-icons';
import { faGreaterThan, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PrivacyComponent } from './containers/privacy/privacy.component';
import { AboutComponent } from './containers/about/about.component';
import { ConditionsComponent } from './containers/conditions/conditions.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { DropdownDirective } from './shared/directives/dropdown.directive';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { AlertComponent } from './components/alert/alert.component';
import { InputComponent } from './components/input/input.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    PrivacyComponent,
    AboutComponent,
    ConditionsComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    AlertComponent,
    InputComponent,
    DropdownDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    FontAwesomeModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFacebookF,
      faInstagram,
      faTwitter,
      faGooglePlusG,
      faGreaterThan,
      faSearch,
      faCheck,
      faFacebookSquare,
      faGooglePlusSquare
    );
  }
}
