import { Component, OnInit, Input } from '@angular/core';
import { Product } from '@app/landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss']
})
export class CollectionListItemComponent implements OnInit {
  @Input() item: Product;

  constructor() { }

  ngOnInit() {
  }

}
