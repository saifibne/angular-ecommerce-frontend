import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { ProductInterface } from '../../models/product.model';
import { ProductDataService } from '../../services/productData.service';
import { switchMap, tap } from 'rxjs/operators';
import { iif, combineLatest, Subscription } from 'rxjs';
import { UserDataService } from '../../services/userData.service';

@Component({
  selector: 'app-category-product',
  templateUrl: 'category-product.component.html',
  styleUrls: ['category-product.component.css'],
})
export class CategoryProductComponent implements OnInit, OnDestroy {
  caretIcon = faCaretDown;
  category: string;
  showSorting = false;
  routerSubscription: Subscription;
  selectedListItem: string = 'New Arrivals';
  products: ProductInterface[];
  @ViewChild('sortList') sortList: ElementRef;
  @ViewChild('showListAnchor') anchor: ElementRef;
  constructor(
    private productService: ProductDataService,
    private currentRoute: ActivatedRoute,
    private renderer: Renderer2,
    private userService: UserDataService
  ) {}
  ngOnInit() {
    this.userService.loadProgressBar.next(true);
    this.userService.showFooter.next(false);
    this.routerSubscription = combineLatest([
      this.currentRoute.params,
      this.currentRoute.queryParams,
    ])
      .pipe(
        tap((params) => {
          this.category = params[0].category;
          this.showSorting = !!params[0].category;
        }),
        switchMap((params) => {
          return iif(
            () => params[0].category,
            this.productService.categoryData(this.category, 'New Arrivals'),
            this.productService.getSearchedProducts(
              this.currentRoute.snapshot.queryParams['search']
            )
          );
        })
      )
      .subscribe((products: { productsData: ProductInterface[] }) => {
        this.products = products.productsData;
        this.userService.loadProgressBar.next(false);
        this.userService.showFooter.next(true);
      });
  }
  showList(element: Element) {
    const width = this.anchor.nativeElement.offsetWidth;
    this.renderer.setStyle(this.sortList.nativeElement, 'width', `${width}px`);
    this.renderer.addClass(element, 'show-list');
  }
  onClickContainer() {
    if (this.sortList) {
      this.renderer.removeClass(this.sortList.nativeElement, 'show-list');
    }
  }
  onSelectItem(value) {
    this.selectedListItem = value;
    this.onClickContainer();
    this.productService
      .categoryData(this.category, value)
      .subscribe((products) => {
        this.products = products.productsData;
      });
  }
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
