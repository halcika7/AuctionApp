import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-landing-page-products',
  templateUrl: './landing-page-products.component.html',
  styleUrls: ['./landing-page-products.component.css']
})
export class LandingPageProductsComponent implements OnInit {
  @Input() title: string;
  @Input() className = 'feature-collection';
  @Input() items: [];

  constructor() {}

  ngOnInit() {}
}
