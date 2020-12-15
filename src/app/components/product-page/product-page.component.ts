import {
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
import { Subscription } from 'rxjs';

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
export class ProductPageComponent implements OnInit, OnDestroy {
  star = faStar;
  checked = faCheckCircle;
  shield = faShieldAlt;
  cart = faShoppingCart;
  wishList = faShoppingBag;
  productId;
  totalImages: number;
  imageCount = 0;
  eachImageWidth: number;
  category: string;
  alreadyReplied = false;
  alreadyCommented = false;
  alreadyWishListed = false;
  showNotification = false;
  deleteItemNotification = false;
  emptyMessage = false;
  emptySubmit = false;
  touchStartPoint: number;
  touchTravelDistance: number;
  alreadyTravelledDistance: number = 0;
  maxTravelDistance: number;
  touchBreakPoint: number;
  imgBulletPoint: number = 1;
  product: mappedProductInterface;
  paramSub: Subscription;
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
  @ViewChild('zoomLens') zoomLens: ElementRef;
  @ViewChild('zoomView') zoomView: ElementRef;
  @ViewChild('mobileSlider') mobileSlider: ElementRef;
  @ViewChild('mobileSliderWrapper') mobileSliderWrapper: ElementRef;
  constructor(
    private currentRoute: ActivatedRoute,
    private productService: ProductDataService,
    private elem: ElementRef,
    private render: Renderer2,
    private userService: UserDataService,
    private router: Router,
    private element: ElementRef
  ) {}
  ngOnInit() {
    this.userService.loadProgressBar.next(true);
    this.userService.showFooter.next(false);
    this.paramSub = this.currentRoute.params.subscribe((params) => {
      this.productId = params['productId'];
      this.category = params['category'];
      this.getProduct(this.productId).subscribe(() => {
        this.userService.loadProgressBar.next(false);
        this.userService.showFooter.next(true);
      });
    });
  }
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
  onSelectImage(imageUrl, element) {
    this.allImages.forEach((image) => {
      this.render.removeClass(image.nativeElement, 'image-active');
    });
    this.render.setProperty(this.image.nativeElement, 'src', imageUrl);
    this.render.addClass(element, 'image-active');
  }
  onAddCart(productId: string) {
    this.userService
      .addToCart(productId, 'add')
      .pipe(take(1))
      .subscribe(
        () => {
          return this.router.navigate(['/account/cart']);
        },
        () => {
          return this.router.navigate(['/user/login']);
        }
      );
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
            return this.router.navigate(['/user/login']);
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
            return this.router.navigate(['/user/login']);
          }
        });
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
  zoomImage() {
    const imageSource = (<HTMLImageElement>this.image.nativeElement).src;
    this.render.setStyle(
      this.zoomView.nativeElement,
      'background-image',
      `url(${imageSource})`
    );
    const imageWidth =
      this.image.nativeElement.width *
      (this.zoomView.nativeElement.offsetWidth /
        this.zoomLens.nativeElement.offsetWidth);
    const imageHeight =
      this.image.nativeElement.height *
      (this.zoomView.nativeElement.offsetHeight /
        this.zoomLens.nativeElement.offsetHeight);
    this.render.setStyle(
      this.zoomView.nativeElement,
      'background-size',
      `${imageWidth}px ${imageHeight}px`
    );
    this.element.nativeElement
      .querySelector('.image')
      .addEventListener('mousemove', this.lensMovement.bind(this));
    this.element.nativeElement
      .querySelector('.product-img-lens')
      .addEventListener('mousemove', this.lensMovement.bind(this));
    this.element.nativeElement
      .querySelector('.image')
      .addEventListener('mouseleave', this.mouseOut.bind(this));
    this.element.nativeElement
      .querySelector('.product-img-lens')
      .addEventListener('mouseleave', this.mouseOut.bind(this));
  }
  lensMovement(event: Event) {
    event.preventDefault();
    this.render.setStyle(this.zoomLens.nativeElement, 'visibility', 'visible');
    this.render.setStyle(this.zoomView.nativeElement, 'visibility', 'visible');
    let position = this.getCursorPosition(event);
    let x = position.x - this.zoomLens.nativeElement.offsetWidth / 2;
    let y = position.y - this.zoomLens.nativeElement.offsetHeight / 2;
    if (
      x >
      this.image.nativeElement.width - this.zoomLens.nativeElement.offsetWidth
    ) {
      x =
        this.image.nativeElement.width -
        this.zoomLens.nativeElement.offsetWidth;
    } else if (x < 0) {
      x = 0;
    }
    if (
      y >
      this.image.nativeElement.height - this.zoomLens.nativeElement.offsetHeight
    ) {
      y =
        this.image.nativeElement.height -
        this.zoomLens.nativeElement.offsetHeight;
    } else if (y < 0) {
      y = 0;
    }
    this.render.setStyle(
      this.zoomLens.nativeElement,
      'transform',
      `translateX(${x}px) translateY(${y}px)`
    );
    this.render.setStyle(
      this.zoomView.nativeElement,
      'background-position',
      `-${x * 2}px -${y * 2}px`
    );
  }
  getCursorPosition(e: Event) {
    let x: number;
    let y: number;
    const imageView = this.image.nativeElement.getBoundingClientRect();
    x = (<MouseEvent>e).pageX - imageView.left;
    y = (<MouseEvent>e).pageY - imageView.top;
    const finalX = x - window.pageXOffset;
    const finalY = y - window.pageYOffset;
    return { x: finalX, y: finalY };
  }
  mouseOut() {
    this.render.removeStyle(this.zoomView.nativeElement, 'visibility');
    this.render.removeStyle(this.zoomLens.nativeElement, 'visibility');
  }
  readySlider() {
    this.totalImages = this.product.imageUrls.length;
    this.imageCount++;
    if (this.imageCount === this.totalImages) {
      this.touchBreakPoint = Math.round(
        this.mobileSliderWrapper.nativeElement.offsetWidth / 2
      );
      this.eachImageWidth = this.mobileSliderWrapper.nativeElement.offsetWidth;
      this.maxTravelDistance = this.eachImageWidth * (this.totalImages - 1);
      this.mobileSlider.nativeElement.addEventListener('touchstart', (e) => {
        this.touchStart(e);
      });
      this.mobileSlider.nativeElement.addEventListener('touchmove', (e) => {
        this.touchMove(e);
      });
      this.mobileSlider.nativeElement.addEventListener('touchend', (e) => {
        this.touchEnd(e);
      });
    }
  }
  touchStart(event: TouchEvent) {
    this.touchStartPoint = event.touches[0].clientX;
  }
  touchMove(event: TouchEvent) {
    const currentPosition = event.touches[0].clientX;
    const travelDistance = this.touchStartPoint - currentPosition;
    this.render.setStyle(
      this.mobileSlider.nativeElement,
      'transform',
      `translateX(${-(travelDistance + this.alreadyTravelledDistance)}px)`
    );
  }
  touchEnd(event: TouchEvent) {
    const touchEndPoint = event.changedTouches[0].clientX;
    this.touchTravelDistance = this.touchStartPoint - touchEndPoint;
    if (this.touchTravelDistance > 0) {
      if (this.touchTravelDistance > this.touchBreakPoint) {
        if (this.alreadyTravelledDistance === this.maxTravelDistance) {
          this.render.setStyle(
            this.mobileSlider.nativeElement,
            'transform',
            `translateX(-${this.alreadyTravelledDistance}px)`
          );
        } else {
          this.render.setStyle(
            this.mobileSlider.nativeElement,
            'transform',
            `translateX(-${
              this.eachImageWidth + this.alreadyTravelledDistance
            }px)`
          );
          this.alreadyTravelledDistance += this.eachImageWidth;
          this.imgBulletPoint += 1;
        }
      } else if (this.touchTravelDistance < this.touchBreakPoint) {
        this.render.setStyle(
          this.mobileSlider.nativeElement,
          'transform',
          `translateX(-${this.alreadyTravelledDistance}px)`
        );
      }
    } else if (this.touchTravelDistance < 0) {
      if (this.touchTravelDistance < -this.touchBreakPoint) {
        if (this.alreadyTravelledDistance === 0) {
          this.render.setStyle(
            this.mobileSlider.nativeElement,
            'transform',
            `translateX(0)`
          );
        } else {
          this.render.setStyle(
            this.mobileSlider.nativeElement,
            'transform',
            `translateX(-${
              this.alreadyTravelledDistance - this.eachImageWidth
            }px)`
          );
          this.alreadyTravelledDistance -= this.eachImageWidth;
          this.imgBulletPoint -= 1;
        }
      } else if (this.touchTravelDistance > -this.touchBreakPoint) {
        this.render.setStyle(
          this.mobileSlider.nativeElement,
          'transform',
          `translateX(-${this.alreadyTravelledDistance}px)`
        );
      }
    }
  }
  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }
}
