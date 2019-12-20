import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Renderer2
} from "@angular/core";

@Component({
  selector: "app-confirm-deactivation-modal",
  templateUrl: "./confirm-deactivation-modal.component.html",
  styleUrls: ["./confirm-deactivation-modal.component.scss"]
})
export class ConfirmDeactivationModalComponent implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter<any>();
  @Output() confirmDeactivation = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, "no-overflow");
  }

  ngOnInit() {}

  onCancleClicked() {
    this.closeModal.emit(false);
  }

  onConfirmClicked() {
    this.confirmDeactivation.emit();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, "no-overflow");
  }
}
