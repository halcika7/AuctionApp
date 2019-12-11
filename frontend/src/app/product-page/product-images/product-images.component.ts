import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-product-images",
  templateUrl: "./product-images.component.html",
  styleUrls: ["./product-images.component.scss"]
})
export class ProductImagesComponent implements OnInit, OnDestroy {
  private _images = [];
  private _activeImage: string;
  private _currentIndex: number;
  private _showModal: boolean = false;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select("productPage")
      .pipe(
        map(state => ({
          ProductImages: [
            { image: state.product.picture },
            ...state.product.ProductImages
          ]
        }))
      )
      .subscribe(({ ProductImages }) => {
        this._images = ProductImages;
        this._activeImage = ProductImages[0].image;
        this._currentIndex = 0;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  imgClicked(imageUrl: string, index: number) {
    this._activeImage = imageUrl;
    this._currentIndex = index;
  }

  arrowClicked(name) {
    if (name == "left" && this._currentIndex != 0) {
      this._currentIndex--;
    }

    if (name == "right" && this._currentIndex != this._images.length - 1) {
      this._currentIndex++;
    }
    this._activeImage = this._images[this._currentIndex].image;
  }

  openModal(open = true) {
    this._showModal = open;
  }

  get images() {
    return this._images;
  }

  get activeImage(): string {
    return this._activeImage;
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

  get showModal(): boolean {
    return this._showModal;
  }
}
