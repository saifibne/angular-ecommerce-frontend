import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { mappedProductInterface } from '../../models/product.model';
import { ProductDataService } from '../../services/productData.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartIcon = faShoppingCart;
  nextIcon = faAngleRight;
  caretIcon = faCaretDown;
  count = -1;
  products: mappedProductInterface[] = [];
  searchBoxSubscription: Subscription;
  searchTextSubscription: Subscription;
  searchText = new Subject<string>();
  @ViewChildren('result', { read: ElementRef }) results: QueryList<ElementRef>;
  constructor(
    private productService: ProductDataService,
    private router: Router,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this.searchTextSubscription = this.searchText
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((input) => {
          return this.productService.getSearchedProducts(input);
        }),
        map((products) => {
          const receivedProducts = products.products;
          return this.productService.mappingProducts(receivedProducts);
        })
      )
      .subscribe((products) => {
        this.products = products;
      });
    this.searchBoxSubscription = this.productService.hideSearchBoxObs.subscribe(
      (result) => {
        this.products = result;
        this.count = -1;
      }
    );
  }
  @HostListener('keydown', ['$event']) selectDropdown(e) {
    if (this.products.length > 0) {
      const results = this.results.toArray();
      for (let result of results) {
        this.renderer.removeClass(result.nativeElement, 'each-result-focused');
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (this.count > results.length - 2) {
            this.count = 0;
          } else {
            this.count++;
          }
          this.renderer.addClass(
            results[this.count].nativeElement,
            'each-result-focused'
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (this.count === -1) {
            this.count = results.length - 1;
          } else if (this.count === 0) {
            this.count = results.length - 1;
          } else {
            this.count--;
          }
          this.renderer.addClass(
            results[this.count].nativeElement,
            'each-result-focused'
          );
          break;
        case 'Enter':
          results[this.count].nativeElement.click();
          break;
        default:
          this.count = -1;
      }
    }
  }
  onSearch(event: Event) {
    const inputValue = (<HTMLInputElement>event.target).value;
    this.searchText.next(inputValue);
  }
  onSelectProduct(productId, category) {
    this.productService.product = this.products.find(
      (product) => product._id === productId
    );
    this.router.navigate(['product', category, productId]).then(() => {
      this.products = [];
    });
  }
  ngOnDestroy() {
    this.searchTextSubscription.unsubscribe();
    this.searchBoxSubscription.unsubscribe();
  }
}
