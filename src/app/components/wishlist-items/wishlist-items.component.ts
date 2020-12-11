import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductDataService } from '../../services/productData.service';
import { Router } from '@angular/router';
import { WishListModel } from '../../models/wishList.model';
import { exhaustMap, take, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../services/userData.service';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wishlist-items',
  templateUrl: 'wishlist-items.component.html',
  styleUrls: ['wishlist-items.component.css'],
})
export class WishlistItemsComponent implements OnInit, OnDestroy {
  trashIcon = faTrash;
  items: WishListModel[];
  wishListSub: Subscription;
  dotIcon = faEllipsisV;
  productId: string;
  @ViewChild('mobileBackdrop') mobileBackdrop: ElementRef;
  @ViewChild('mobileRemoveModal') mobileRemoveModal: ElementRef;
  constructor(
    private productService: ProductDataService,
    private router: Router,
    private renderer: Renderer2,
    private userService: UserDataService
  ) {}
  ngOnInit() {
    this.userService.loadProgressBar.next(true);
    this.userService.showFooter.next(false);
    this.wishListSub = this.rerunDataBase().subscribe(() => {
      this.userService.loadProgressBar.next(false);
      this.userService.showFooter.next(true);
    });
  }
  rerunDataBase() {
    return this.productService.getWishlistItems().pipe(
      tap((result: { message: string; wishList: WishListModel[] }) => {
        if (result) {
          this.items = result.wishList.map((item) => {
            const offerPercentage = Math.round(
              ((item.productId.originalPrice - item.productId.offerPrice) /
                item.productId.originalPrice) *
                100
            );
            return { ...item, offerPercentage: offerPercentage };
          });
        } else {
          return this.router.navigate(['login']);
        }
      })
    );
  }
  onClickDelete(element: Element) {
    this.renderer.addClass(element, 'show-modal');
  }
  onCancel(element: Element) {
    this.renderer.removeClass(element, 'show-modal');
  }
  deleteWishItem(itemId: string) {
    this.productService
      .deleteWishListItem(itemId)
      .pipe(
        take(1),
        exhaustMap(() => {
          return this.rerunDataBase();
        })
      )
      .subscribe();
  }
  deleteWishItemMobile() {
    if (this.productId) {
      this.productService
        .deleteWishListItem(this.productId)
        .pipe(
          take(1),
          exhaustMap(() => {
            return this.rerunDataBase();
          })
        )
        .subscribe(() => {
          this.closeModal();
        });
    }
  }
  onClickDot(productId: string) {
    this.productId = productId;
    this.renderer.addClass(
      this.mobileBackdrop.nativeElement,
      'show-mobile__backdrop'
    );
    this.renderer.addClass(
      this.mobileRemoveModal.nativeElement,
      'show-mobile__remove-notification'
    );
  }
  closeModal() {
    this.productId = null;
    this.renderer.removeClass(
      this.mobileBackdrop.nativeElement,
      'show-mobile__backdrop'
    );
    this.renderer.removeClass(
      this.mobileRemoveModal.nativeElement,
      'show-mobile__remove-notification'
    );
  }
  ngOnDestroy() {
    this.wishListSub.unsubscribe();
  }
}
