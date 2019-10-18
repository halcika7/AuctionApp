import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, BreadcrumbComponent],
  imports: [BrowserModule, HttpClientModule, FontAwesomeModule],
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
