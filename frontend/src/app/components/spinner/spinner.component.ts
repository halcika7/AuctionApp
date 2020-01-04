import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, "no-overflow");
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.renderer.removeClass(document.body, "no-overflow");
  }
}
