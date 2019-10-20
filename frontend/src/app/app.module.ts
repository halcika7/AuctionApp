import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './containers/home/home.component';
import { DropdownDirective } from './shared/directives/dropdown.directive';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

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
    AuthComponent,
    HomeComponent,
    DropdownDirective,
    LoginComponent,
    RegisterComponent
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, FontAwesomeModule, AppRoutingModule],
  providers: [],
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
