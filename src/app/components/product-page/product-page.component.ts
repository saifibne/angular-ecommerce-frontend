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
import { ActivatedRoute, Router } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

import { ProductDataService } from '../../services/productData.service';
import { mappedProductInterface } from '../../models/product.model';
import { UserDataService } from '../../services/userData.service';

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
  isUserLogIn: boolean;
  alreadyReplied = false;
  alreadyCommented = false;
  emptyMessage = false;
  emptySubmit = false;
  product: mappedProductInterface;
  @ViewChildren('imageSources', { read: ElementRef }) imageSources: QueryList<
    ElementRef
  >;
  @ViewChildren('allImages', { read: ElementRef }) allImages: QueryList<
    ElementRef
  >;
  @ViewChildren('reviewInput', { read: ElementRef }) allStarInputs: QueryList<
    ElementRef
  >;
  @ViewChild('image') image: ElementRef;
  constructor(
    private currentRoute: ActivatedRoute,
    private productService: ProductDataService,
    private elem: ElementRef,
    private render: Renderer2,
    private userService: UserDataService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userService.userLogInObs.subscribe((result) => {
      this.isUserLogIn = result;
    });
    this.currentRoute.params.subscribe((params) => {
      this.productId = params['productId'];
      this.category = params['category'];
      this.getProduct(this.productId);
    });
  }
  ngAfterViewInit() {}
  getProduct(productId) {
    this.productService
      .getProductFromDatabase(productId)
      .subscribe(
        (product: { message: string; productData: mappedProductInterface }) => {
          this.product = product.productData;
        }
      );
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
  onAddCart(productId: string) {
    this.userService.addToCart(productId, 'add').subscribe((result) => {
      return this.router.navigate(['/cart']);
    });
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
    this.emptyMessage = false;
    this.alreadyReplied = false;
    if (message === '') {
      this.emptyMessage = true;
      return;
    }
    this.productService
      .postAddCommentsReply(message, productId, commentId)
      .subscribe((result: { message: string; status: number }) => {
        switch (result.status) {
          case 301:
            this.alreadyReplied = true;
            break;
          case 200:
            this.emptyMessage = false;
            this.getProduct(this.productId);
            this.onCancel(element);
        }
      });
  }
  onCancel(element: Element) {
    this.alreadyReplied = false;
    this.emptyMessage = false;
    this.render.removeStyle(element, 'max-height');
  }
  onRateProduct(element: Element) {
    this.render.addClass(element, 'show-submit__wrapper');
  }
  onSubmitComment(
    productId: string,
    title: string,
    comment: string,
    element: Element
  ) {
    this.alreadyCommented = false;
    this.emptySubmit = false;
    if (title === '' || comment === '') {
      this.emptySubmit = true;
      return;
    }
    new Promise((resolve) => {
      this.allStarInputs.forEach((starInput) => {
        if ((<HTMLInputElement>starInput.nativeElement).checked) {
          resolve(+(<HTMLInputElement>starInput.nativeElement).value);
        }
      });
    })
      .then((ratingValue: number) => {
        return this.productService
          .postAddComment(productId, title, comment, ratingValue)
          .toPromise();
      })
      .then((result: { message: string; status: number }) => {
        switch (result.status) {
          case 301:
            this.alreadyCommented = true;
            break;
          case 200:
            this.getProduct(this.productId);
            this.onCancelSubmit(element);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onCancelSubmit(element: Element) {
    this.render.removeClass(element, 'show-submit__wrapper');
    this.alreadyCommented = false;
    this.emptySubmit = false;
    this.allStarInputs.forEach((starInput) => {
      (<HTMLInputElement>starInput.nativeElement).checked = false;
    });
  }
}
