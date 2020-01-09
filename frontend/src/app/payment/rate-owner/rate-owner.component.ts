import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Renderer2,
  Input
} from "@angular/core";
import { OwnerInfo } from "@app/product-page/store/product-page.reducer";

@Component({
  selector: "app-rate-owner",
  templateUrl: "./rate-owner.component.html",
  styleUrls: ["./rate-owner.component.scss"]
})
export class RateOwnerComponent implements OnInit, OnDestroy {
  @Output() confirmOrder = new EventEmitter<any>();
  @Input() ownerInfo: OwnerInfo;
  @Input() previousRating: number;
  @Input() userRating: number;
  private _selectedRating: number = null;
  private _class = "0";

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, "no-overflow");
  }

  ngOnInit() {
    if (this.userRating) {
      this._selectedRating = this.userRating;
      this.changeClass(this._selectedRating);
    }
  }

  onConfirmClicked(notRated = false) {
    this._selectedRating = notRated ? null : this._selectedRating;
    this.confirmOrder.emit(this._selectedRating);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, "no-overflow");
  }

  onChangeRating(value: number, classValue: string) {
    this._selectedRating = value;
    this._class = classValue;
  }

  private changeClass(value: number) {
    switch (value) {
      case 1:
        this._class = "one";
        break;
      case 2:
        this._class = "two";
        break;
      case 3:
        this._class = "three";
        break;
      case 4:
        this._class = "four";
        break;
      case 5:
        this._class = "five";
        break;

      default:
        break;
    }
  }

  get class(): string {
    return this._class;
  }

  get selectedRating(): number {
    return this._selectedRating;
  }
}
