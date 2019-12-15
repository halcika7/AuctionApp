import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AddProductService } from "../add-product.service";

@Component({
  selector: "app-no-active",
  templateUrl: "./no-active.component.html",
  styleUrls: ["./no-active.component.scss"]
})
export class NoActiveComponent implements OnInit {

  constructor(private addProductService: AddProductService) {}

  ngOnInit() {}

  onButtonClicked() {
    this.addProductService.changeStepValue(1);
  }
}
