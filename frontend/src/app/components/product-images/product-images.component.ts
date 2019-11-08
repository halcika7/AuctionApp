import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  private _images = [];
  private _activeImage: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store
      .select('productPage')
      .pipe(
        map(state => ({
          ProductImages: [{ image: state.product.picture }, ...state.product.ProductImages]
        }))
      )
      .subscribe(({ ProductImages }) => {
        this.images = ProductImages;
        this.activeImage = ProductImages[0].image;
      });
  }

  imgClicked(e) {
    this.activeImage = e.target.src;
  }

  set images(images) {
    this._images = images;
  }

  get images() {
    return this._images;
  }

  set activeImage(url: string) {
    this._activeImage = url;
  }

  get activeImage(): string {
    return this._activeImage;
  }
}
