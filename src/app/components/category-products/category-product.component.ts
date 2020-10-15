import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { ProductInterface } from '../../models/product.model';
import { ProductDataService } from '../../services/productData.service';

@Component({
  selector: 'app-category-product',
  templateUrl: 'category-product.component.html',
  styleUrls: ['category-product.component.css'],
})
export class CategoryProductComponent implements OnInit {
  caretIcon = faCaretDown;
  category: string;
  selectedListItem: string = 'New Arrivals';
  products: ProductInterface[];
  @ViewChild('sortList') sortList: ElementRef;
  @ViewChild('showListAnchor') anchor: ElementRef;
  constructor(
    private productService: ProductDataService,
    private currentRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this.currentRoute.params.subscribe((params) => {
      this.category = params['category'];
      this.productService
        .categoryData(this.category, 'New Arrivals')
        .subscribe((products) => {
          this.products = products.productsData;
        });
    });
  }
  getImageUrl(product: ProductInterface) {
    return `http://localhost:3000/${product.imageUrls[0].path}`;
  }
  showList(element: Element) {
    const width = this.anchor.nativeElement.offsetWidth;
    this.renderer.setStyle(this.sortList.nativeElement, 'width', `${width}px`);
    this.renderer.addClass(element, 'show-list');
  }
  onClickContainer() {
    this.renderer.removeClass(this.sortList.nativeElement, 'show-list');
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
}
