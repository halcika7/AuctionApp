import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { Ng5SliderModule } from 'ng5-slider';

// Components
import { AppComponent } from "@app/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { PrivacyComponent } from "./containers/privacy/privacy.component";
import { AboutComponent } from "./containers/about/about.component";
import { ConditionsComponent } from "./containers/conditions/conditions.component";
import { NotFoundComponent } from "./containers/not-found/not-found.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { AlertComponent } from "./components/alert/alert.component";
import { InputComponent } from "./components/input/input.component";
import { CategoriesListComponent } from "./components/categories-list/categories-list.component";
import { CarouselComponent } from "./components/carousel/carousel.component";
import { LandingPageProductsComponent } from "./components/landing-page-products/landing-page-products.component";
import { ProductTabsComponent } from "./components/product-tabs/product-tabs.component";
import { CollectionItemComponent } from "./components/collection-item/collection-item.component";
import { AllCategoriesComponent } from "./containers/all-categories/all-categories.component";
import { ProductPageComponent } from "./product-page/product-page.component";
import { ProductImagesComponent } from "./components/product-images/product-images.component";
import { ProductBidsComponent } from "./components/product-bids/product-bids.component";

// ngRx
import * as fromApp from "./store/app.reducer";
import { AuthEffects } from "./auth/store/auth.effects";
import { LandingPageEffects } from "./landing-page/store/landing-page.effects";
import { CategoriesPageEffects } from "./containers/all-categories/store/all-categories.effects";
import { ProductPageEffects } from "./product-page/store/product-page.effects";
import { ShopPageEffects } from "./shop-page/store/shop-page.effects";

// Font Awesome Icons
import {
  FontAwesomeModule,
  FaIconLibrary
} from "@fortawesome/angular-fontawesome";
import {
  faFacebookF,
  faFacebookSquare,
  faInstagram,
  faTwitter,
  faGooglePlusSquare,
  faGooglePlusG
} from "@fortawesome/free-brands-svg-icons";
import {
  faGreaterThan,
  faSearch,
  faCheck,
  faHeart,
  faGavel,
  faThList,
  faTh
} from "@fortawesome/free-solid-svg-icons";

// Services, directives and pipes
import { DropdownDirective } from "./shared/directives/dropdown.directive";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { DropdownNoautocloseDirective } from "./shared/directives/dropdown-noautoclose.directive";
import { TruncateTextPipe } from "./shared/pipes/truncate-text.pipe";
import { DateAgoPipe } from "./shared/pipes/date-ago.pipe";
import { ShopPageComponent } from './shop-page/shop-page.component';
import { CollectionListItemComponent } from './components/collection-list-item/collection-list-item.component';

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
    DropdownDirective,
    CategoriesListComponent,
    CarouselComponent,
    LandingPageProductsComponent,
    ProductTabsComponent,
    CollectionItemComponent,
    AllCategoriesComponent,
    DropdownNoautocloseDirective,
    TruncateTextPipe,
    ProductPageComponent,
    ProductImagesComponent,
    DateAgoPipe,
    ProductBidsComponent,
    ShopPageComponent,
    CollectionListItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([
      AuthEffects,
      LandingPageEffects,
      CategoriesPageEffects,
      ProductPageEffects,
      ShopPageEffects
    ]),
    FontAwesomeModule,
    Ng5SliderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
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
      faGooglePlusSquare,
      faHeart,
      faGavel,
      faTh,
      faThList
    );
  }
}
