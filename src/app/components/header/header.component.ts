import {
  Component,
  ElementRef,
  HostListener,
  Input,
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
  retryWhen,
  switchMap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { faAngleLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { ProductInterface } from '../../models/product.model';
import { ProductDataService } from '../../services/productData.service';
import { UserDataService } from '../../services/userData.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input('userLogIn') userLogIn: boolean;
  cartIcon = faShoppingCart;
  nextIcon = faAngleRight;
  prevIcon = faAngleLeft;
  caretIcon = faCaretDown;
  count = -1;
  products: ProductInterface[] = [];
  searchBoxSubscription: Subscription;
  searchTextSubscription: Subscription;
  searchText = new Subject<string>();
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchBtn') searchBtn: ElementRef;
  @ViewChildren('result', { read: ElementRef }) results: QueryList<ElementRef>;
  constructor(
    private productService: ProductDataService,
    private userService: UserDataService,
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
        retryWhen((errors) => {
          return errors;
        })
      )
      .subscribe(
        (products: { productsData: ProductInterface[] }) => {
          this.products = products.productsData;
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
          this.renderer.setProperty(
            this.searchInput.nativeElement,
            'value',
            results[this.count].nativeElement.children[0].innerText
          );
          break;
        case 'Enter':
          if (results[this.count]) {
            results[this.count].nativeElement.click();
          } else if ((<HTMLInputElement>this.searchInput.nativeElement).focus) {
            (<HTMLButtonElement>this.searchBtn.nativeElement).click();
          }
          break;
        default:
          this.count = -1;
      }
    } else if ((<HTMLInputElement>this.searchInput.nativeElement).focus) {
      if (e.key === 'Enter') {
        (<HTMLButtonElement>this.searchBtn.nativeElement).click();
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
  onClick(value: string) {
    return this.router.navigate(['/search'], {
      queryParams: { search: value },
    });
  }
  onLogout() {
    this.userService.logout();
    return this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.searchTextSubscription.unsubscribe();
    this.searchBoxSubscription.unsubscribe();
  }
}
