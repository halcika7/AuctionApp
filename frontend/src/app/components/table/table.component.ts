import { Component, OnInit, Input } from "@angular/core";
import { ProfileProduct, ProfileBid } from "@app/profile/store/profile.reducer";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  @Input() values: ProfileProduct[] | ProfileBid[];
  @Input() type: string;

  constructor() {}

  ngOnInit() {}
}
