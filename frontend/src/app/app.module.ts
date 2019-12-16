import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { Ng5SliderModule } from "ng5-slider";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxImageZoomModule } from "ngx-image-zoom";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

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
import { ProductTabsComponent } from "./landing-page/product-tabs/product-tabs.component";
import { CollectionItemComponent } from "./components/collection-item/collection-item.component";
import { AllCategoriesComponent } from "./containers/all-categories/all-categories.component";
import { ProductPageComponent } from "./product-page/product-page.component";
import { ProductImagesComponent } from "./product-page/product-images/product-images.component";
import { ProductBidsComponent } from "./product-page/product-bids/product-bids.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { ProfileComponent } from "./profile/profile.component";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { ProfileSettingsComponent } from "./profile/profile-settings/profile-settings.component";
import { DateInputComponent } from "./profile/edit-profile/date-input/date-input.component";
import { SelectInputComponent } from "./components/select-input/select-input.component";
import { UploadPhotoComponent } from "./profile/edit-profile/required-info/upload-photo/upload-photo.component";
import { SellerComponent } from "./profile/seller/seller.component";
import { BidsComponent } from "./profile/bids/bids.component";
import { WishlistComponent } from "./profile/wishlist/wishlist.component";
import { TableComponent } from "./components/table/table.component";
import { RequiredInfoComponent } from "./profile/edit-profile/required-info/required-info.component";
import { OptionalInfoComponent } from "./profile/edit-profile/optional-info/optional-info.component";
import { CardInfoComponent } from "./profile/edit-profile/card-info/card-info.component";
import { SearchComponent } from "./shop-page/search/search.component";
import { ShopPageComponent } from "./shop-page/shop-page.component";
import { CollectionListItemComponent } from "./components/collection-list-item/collection-list-item.component";
import { ShopPriceComponent } from "./shop-page/shop-price/shop-price.component";
import { ShopFiltersComponent } from "./shop-page/shop-filters/shop-filters.component";
import { ShopNavigationComponent } from "./shop-page/shop-navigation/shop-navigation.component";

// ngRx
import * as fromApp from "./store/app.reducer";
import { AuthEffects } from "./auth/store/auth.effects";
import { LandingPageEffects } from "./landing-page/store/landing-page.effects";
import { CategoriesPageEffects } from "./containers/all-categories/store/all-categories.effects";
import { ProductPageEffects } from "./product-page/store/product-page.effects";
import { ShopPageEffects } from "./shop-page/store/shop-page.effects";
import { ProfileEffects } from "./profile/store/profile.effects";
import { AddProductEffects } from "./add-product/store/add-product.effects";

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
  faTh,
  faUserAlt,
  faCog,
  faTimes,
  faChevronCircleLeft,
  faChevronCircleRight,
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
  faDollarSign
} from "@fortawesome/free-solid-svg-icons";

// Services, directives and pipes
import { DropdownDirective } from "./shared/directives/dropdown.directive";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { DropdownNoautocloseDirective } from "./shared/directives/dropdown-noautoclose.directive";
import { TruncateTextPipe } from "./shared/pipes/truncate-text.pipe";
import { DateAgoPipe } from "./shared/pipes/date-ago.pipe";
import { ConfirmDeactivationModalComponent } from "./profile/profile-settings/confirm-deactivation-modal/confirm-deactivation-modal.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { FirstStepComponent } from "./add-product/first-step/first-step.component";
import { LastStepComponent } from "./add-product/last-step/last-step.component";
import { SecondStepComponent } from "./add-product/second-step/second-step.component";
import { NoActiveComponent } from "./add-product/no-active/no-active.component";
import { UploadImagesComponent } from "./add-product/upload-images/upload-images.component";
import { CustomDateInputComponent } from "./add-product/second-step/custom-date-input/custom-date-input.component";

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
    CollectionListItemComponent,
    ShopPriceComponent,
    ShopFiltersComponent,
    ShopNavigationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    EditProfileComponent,
    ProfileSettingsComponent,
    DateInputComponent,
    SelectInputComponent,
    UploadPhotoComponent,
    SellerComponent,
    BidsComponent,
    WishlistComponent,
    TableComponent,
    RequiredInfoComponent,
    OptionalInfoComponent,
    CardInfoComponent,
    SearchComponent,
    ConfirmDeactivationModalComponent,
    AddProductComponent,
    FirstStepComponent,
    LastStepComponent,
    SecondStepComponent,
    NoActiveComponent,
    UploadImagesComponent,
    CustomDateInputComponent
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
      ShopPageEffects,
      ProfileEffects,
      AddProductEffects
    ]),
    FontAwesomeModule,
    Ng5SliderModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgxImageZoomModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule
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
      faThList,
      faUserAlt,
      faCog,
      faTimes,
      faChevronCircleLeft,
      faChevronCircleRight,
      faChevronLeft,
      faChevronRight,
      faCalendarAlt,
      faDollarSign
    );
  }
}
