import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnDestroy,
  Renderer2
} from "@angular/core";

@Component({
  selector: "app-modal-image-gallery",
  templateUrl: "./modal-image-gallery.component.html",
  styleUrls: ["./modal-image-gallery.component.scss"]
})
export class ModalImageGalleryComponent implements OnInit, OnDestroy {
  @Input() images = [];
  @Input() activeImage: string;
  @Input() currentIndex: number;
  @Output() closeModal = new EventEmitter<any>();

  private _Images;
  private _ActiveImage: string;
  private _CurrentIndex: number;
  private numberOfImages: number = 9;
  private translateOffset: number = 128;
  private _translate = { transform: 'translateX(0px)' };
  private _currentTranslate: number = 0;
  private _showTumbArrows = true;

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, "no-overflow");
  }

  ngOnInit() {
    this._Images = [
      ...this.images
      // ...this.images,
      // ...this.images,
      // ...this.images,
      // ...this.images,
      // ...this.images,
      // ...this.images,
      // ...this.images
    ];
    this._ActiveImage = this.activeImage;
    this._CurrentIndex = this.currentIndex;
    this.windowWidthHelper(window.innerWidth);
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize(event) {
    this.windowWidthHelper(event.target.innerWidth);
  }

  closeModalClicked() {
    this.closeModal.emit(false);
  }

  @HostListener("window:keyup", ["$event"])
  arrowClicked(e, name: string) {
    if ((e.keyCode === 37 || name === "left") && this._CurrentIndex != 0) {
      this._CurrentIndex--;
    }

    if (
      (e.keyCode === 39 || name === "right") &&
      this._CurrentIndex != this._Images.length - 1
    ) {
      this._CurrentIndex++;
    }

    if (this._CurrentIndex > this.numberOfImages - 1) {
      this._currentTranslate = this.calculateTranslate(this._CurrentIndex);
      this._translate = {
        transform: `translateX(-${this._currentTranslate}px)`
      };
    } else {
      this._translate = {
        transform: `translateX(-0px)`
      };
    }

    this._ActiveImage = this._Images[this._CurrentIndex].image;
  }

  private windowWidthHelper(width: number) {
    this.translateOffset = width > 1200 ? 120 : 128;
    if (width > 1200 && this.numberOfImages != 9) {
      this.numberOfImages = 9;
    } else if (width >= 992 && width <= 1200 && this.numberOfImages != 7) {
      this.numberOfImages = 7;
    } else if (width >= 900 && width < 992 && this.numberOfImages != 6) {
      this.numberOfImages = 6;
    } else if (width >= 758 && width < 900 && this.numberOfImages != 5) {
      this.numberOfImages = 5;
    } else if (width >= 640 && width < 758 && this.numberOfImages != 4) {
      this.numberOfImages = 4;
    } else if (width >= 515 && width < 640 && this.numberOfImages != 3) {
      this.numberOfImages = 3;
    } else if (width >= 375 && width < 515 && this.numberOfImages != 2) {
      this.numberOfImages = 2;
    } else if (width < 375 && this.numberOfImages != 1) {
      this.numberOfImages = 1;
    }
    this._showTumbArrows =
      this.numberOfImages >= this._Images.length ? false : true;
    if (
      this._showTumbArrows == false &&
      this._translate.transform != 'translateX(0px)'
    ) {
      this._translate.transform = 'translateX(0px)';
    }
  }

  private calculateTranslate(value: number): number {
    return (
      Math.floor(value / this.numberOfImages) *
      this.numberOfImages *
      this.translateOffset
    );
  }

  thumbnailsClicked(name, i = null) {
    const diff = this.calculateTranslate(this._Images.length);

    if (name === "picture") {
      this._CurrentIndex = i;
      this._ActiveImage = this._Images[this._CurrentIndex].image;
      if(!this._showTumbArrows) {
        this._currentTranslate = this.calculateTranslate(this._CurrentIndex);
        this._translate.transform = `translateX(-${this._currentTranslate}px)`;
      }
    }
    if (!this._showTumbArrows) return;

    if (
      name === "right" &&
      this._currentTranslate <= diff - this.translateOffset
    ) {
      this._currentTranslate += this.translateOffset;
      this._translate.transform = `translateX(-${this._currentTranslate}px)`;
    }

    if (name === "left" && this._currentTranslate > 0) {
      this._currentTranslate -= this.translateOffset;
      this._translate.transform = `translateX(-${this._currentTranslate}px)`;
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, "no-overflow");
  }

  get Images(): any[] {
    return this._Images;
  }

  get ActiveImage(): string {
    return this._ActiveImage;
  }

  get CurrentIndex(): number {
    return this._CurrentIndex;
  }

  get translate() {
    return this._translate;
  }

  get showTumbArrows(): boolean {
    return this._showTumbArrows;
  }
}
