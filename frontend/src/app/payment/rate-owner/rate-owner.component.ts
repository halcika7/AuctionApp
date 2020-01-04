import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Renderer2
} from "@angular/core";

@Component({
  selector: "app-rate-owner",
  templateUrl: "./rate-owner.component.html",
  styleUrls: ["./rate-owner.component.scss"]
})
export class RateOwnerComponent implements OnInit, OnDestroy {
  @Output() confirmOrder = new EventEmitter<any>();
  private _selectedRating: number = null;
  private _class = '0';

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, "no-overflow");
  }

  ngOnInit() {}

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

  get class(): string {
    return this._class;
  }

  get selectedRating(): number {
    return this._selectedRating;
  }
}
