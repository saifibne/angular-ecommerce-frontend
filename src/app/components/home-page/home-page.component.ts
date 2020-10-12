import { Component, ElementRef, OnInit } from '@angular/core';
import { ProductDataService } from '../../services/productData.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private elem: ElementRef,
    private productService: ProductDataService
  ) {}
  ngOnInit() {
    this.elem.nativeElement
      .querySelector('.hide-searchBox-container')
      .addEventListener(
        'wheel',
        () => {
          this.productService.hideSearchBoxObs.next([]);
        },
        { passive: true }
      );
  }
}
