import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class ProductPageComponent implements OnInit, AfterViewInit, OnDestroy {
  star = faStar;
  shield = faShieldAlt;
  cart = faShoppingCart;
  wishList = faShoppingBag;
  productId;
  category: string;
  product: mappedProductInterface;
  productSubscription: Subscription;
  @ViewChildren('starIcon', { read: ElementRef }) stars: QueryList<ElementRef>;
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
    this.productSubscription = this.productService.productObs.subscribe(
      (product) => {
        this.product = product;
        // console.log(this.product);
      }
    );
    this.currentRoute.params.subscribe((params) => {
      this.productId = params['productId'];
      this.category = params['category'];
      this.productService.getSingleProduct(this.category, this.productId);
    });
  }
  ngAfterViewInit() {
    const starsArray = this.stars.toArray();
    for (let star of starsArray) {
      const index = starsArray.indexOf(star, 0);
      if (index < this.product.totalRating) {
        this.render.addClass(star.nativeElement, 'star-active');
      }
    }
    this.imageSources.forEach((image) => {
      if (
        image.nativeElement.attributes.src.value ===
        `http://localhost:3000/${this.product.imageUrls[0].path}`
      ) {
        this.render.addClass(image.nativeElement.parentElement, 'image-active');
      }
    });
  }
  get images() {
    return this.product.imageUrls;
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
    const imageUrl = this.product.imageUrls[0].path;
    return `http://localhost:3000/${imageUrl}`;
  }
  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}
