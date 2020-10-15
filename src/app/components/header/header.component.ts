import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  retryWhen,
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
  @ViewChild('searchInput') searchInput: ElementRef;
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
          const changedInput = input.replace(
            /[!@#$%^&*()\-=+/\\_|}\]{\['";:,.?<>]/gi,
            ''
          );
          return this.productService.getSearchedProducts(changedInput);
        }),
        map((products) => {
          const receivedProducts = products.products;
          return this.productService.mappingProducts(receivedProducts);
        }),
        retryWhen((errors) => {
          return errors;
        })
      )
      .subscribe(
        (products) => {
          this.products = products;
        },
        (error) => {
          console.log(error);
        }
      );
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
          this.renderer.setProperty(
            this.searchInput.nativeElement,
            'value',
            results[this.count].nativeElement.children[0].innerText
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
    this.router.navigate(['product', category, productId]).then(() => {
      this.products = [];
    });
  }
  ngOnDestroy() {
    this.searchTextSubscription.unsubscribe();
    this.searchBoxSubscription.unsubscribe();
  }
}
