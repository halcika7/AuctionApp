import { Bid } from '@app/product-page/store/product-page.reducer';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-bids',
  templateUrl: './product-bids.component.html',
  styleUrls: ['./product-bids.component.scss']
})
export class ProductBidsComponent implements OnInit {
  @Input() bids: Bid[] = [];

  constructor() {}

  ngOnInit() {}
}
