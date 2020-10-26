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
import { ActivatedRoute, Router } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { switchMap, take, tap } from 'rxjs/operators';

import { ProductDataService } from '../../services/productData.service';
import { mappedProductInterface } from '../../models/product.model';
import { UserDataService } from '../../services/userData.service';
import { WishListModel } from '../../models/wishList.model';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: [
    '../cart-page/cart-page.component.css',
    'product-page.component.css',
  ],
})
export class ProductPageComponent implements OnInit, AfterViewInit, OnDestroy {
  star = faStar;
  checked = faCheckCircle;
  shield = faShieldAlt;
  cart = faShoppingCart;
  wishList = faShoppingBag;
  productId;
  category: string;
  alreadyReplied = false;
  alreadyCommented = false;
  alreadyWishListed = false;
  showNotification = false;
  deleteItemNotification = false;
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
    this.currentRoute.params.subscribe((params) => {
      this.productId = params['productId'];
      this.category = params['category'];
      this.getProduct(this.productId).subscribe();
    });
  }
  ngAfterViewInit() {}
  getProduct(productId) {
    return this.productService.getProductFromDatabase(productId).pipe(
      tap(
        (product: { message: string; productData: mappedProductInterface }) => {
          this.product = product.productData;
        }
      ),
      switchMap(() => {
        return this.productService.getWishlistItems();
      }),
      tap((result: { message: string; wishList: WishListModel[] }) => {
        if (result) {
          const wishItemIndex = result.wishList.findIndex((item) => {
            return item.productId._id.toString() === this.productId.toString();
          });
          this.alreadyWishListed = wishItemIndex !== -1;
        }
      })
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
    this.userService
      .addToCart(productId, 'add')
      .pipe(take(1))
      .subscribe(() => {
        return this.router.navigate(['/cart']);
      });
  }
  onAddWishList(productId: string) {
    if (this.alreadyWishListed) {
      this.productService
        .deleteWishListItem(productId)
        .pipe(
          take(1),
          switchMap(() => {
            return this.getProduct(this.productId);
          })
        )
        .subscribe((result) => {
          if (result) {
            this.showNotification = true;
            this.deleteItemNotification = true;
            setTimeout(() => {
              this.showNotification = false;
              this.deleteItemNotification = false;
            }, 2000);
          } else {
            return this.router.navigate(['login']);
          }
        });
    } else {
      this.productService
        .addWishListItem(productId)
        .pipe(
          take(1),
          switchMap(() => {
            return this.getProduct(this.productId);
          })
        )
        .subscribe((result) => {
          if (result) {
            this.showNotification = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 2000);
          } else {
            return this.router.navigate(['login']);
          }
        });
    }
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
      .pipe(take(1))
      .subscribe((result: { message: string; status: number }) => {
        switch (result.status) {
          case 301:
            this.alreadyReplied = true;
            break;
          case 200:
            this.emptyMessage = false;
            this.getProduct(this.productId).subscribe();
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
            this.getProduct(this.productId).subscribe();
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
  ngOnDestroy() {}
}
