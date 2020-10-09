import { Directive, HostListener } from '@angular/core';
import { ProductDataService } from '../services/productData.service';

@Directive({
  selector: '[hide-searchBox]',
})
export class HideSearchBoxDirective {
  constructor(private productService: ProductDataService) {}
  @HostListener('click') clickFunction() {
    this.productService.hideSearchBoxObs.next([]);
  }
  @HostListener('wheel') wheelFunction() {
    this.productService.hideSearchBoxObs.next([]);
  }
}
