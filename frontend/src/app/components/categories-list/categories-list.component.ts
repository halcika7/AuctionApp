import { Component, OnInit, Input } from '@angular/core';
import { Categories } from '@app/containers/all-categories/store/all-categories.reducer';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  @Input() categories: Categories[];
  isOpen = false;

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
