import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

import { ProductDataService } from '../../services/productData.service';
import { mappedProductInterface } from '../../models/product.model';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['product-page.component.css'],
})
export class ProductPageComponent implements OnInit, AfterViewInit {
  star = faStar;
  shield = faShieldAlt;
  cart = faShoppingCart;
  wishList = faShoppingBag;
  productId;
  category: string;
  product: mappedProductInterface;
  @ViewChildren('imageSources', { read: ElementRef }) imageSources: QueryList<
    ElementRef
  >;
  @ViewChildren('allImages', { read: ElementRef }) allImages: QueryList<
    ElementRef
  >;
  @ViewChild('image') image: ElementRef;
  constructor(
    private currentRoute: ActivatedRoute,
    private productService: ProductDataService,
    private elem: ElementRef,
    private render: Renderer2
  ) {}
  ngOnInit() {
    this.currentRoute.params.subscribe((params) => {
      this.productId = params['productId'];
      this.category = params['category'];
      this.getProduct(this.productId);
    });
    this.elem.nativeElement
      .querySelector('.product-page__wrapper')
      .addEventListener(
        'wheel',
        () => {
          this.productService.hideSearchBoxObs.next([]);
        },
        { passive: true }
      );
  }
  ngAfterViewInit() {}
  getProduct(productId) {
    this.productService
      .getProductFromDatabase(productId)
      .subscribe((product) => {
        this.product = product.productData;
      });
  }
  get images() {
    if (this.product) {
      return this.product.imageUrls;
    }
  }
  getImageUrl(path) {
    return `http://localhost:3000/${path}`;
  }
  onSelectImage(imageUrl, element) {
    this.allImages.forEach((image) => {
      this.render.removeClass(image.nativeElement, 'image-active');
    });
    this.render.setProperty(
      this.image.nativeElement,
      'src',
      `http://localhost:3000/${imageUrl}`
    );
    this.render.addClass(element, 'image-active');
  }
  imageUrl() {
    if (this.product) {
      const imageUrl = this.product.imageUrls[0].path;
      return `http://localhost:3000/${imageUrl}`;
    }
  }
  onComment(event: Event) {
    this.render.setStyle(
      (<HTMLButtonElement>event.target).nextElementSibling,
      'max-height',
      '300px'
    );
  }
  onSubmitReply(
    productId: string,
    commentId: string,
    message: string,
    element: Element
  ) {
    this.productService
      .postAddCommentsReply(message, productId, commentId)
      .subscribe(() => {
        this.getProduct(this.productId);
        this.onCancel(element);
      });
  }
  onCancel(element: Element) {
    this.render.removeStyle(element, 'max-height');
  }
}
