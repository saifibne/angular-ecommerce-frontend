import { Component, OnInit, Renderer2 } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductDataService } from '../../services/productData.service';
import { Router } from '@angular/router';
import { WishListModel } from '../../models/wishList.model';

@Component({
  selector: 'app-wishlist-items',
  templateUrl: 'wishlist-items.component.html',
  styleUrls: ['wishlist-items.component.css'],
})
export class WishlistItemsComponent implements OnInit {
  trashIcon = faTrash;
  items: WishListModel[];
  constructor(
    private productService: ProductDataService,
    private router: Router,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this.productService
      .getWishlistItems()
      .subscribe((result: { message: string; wishList: WishListModel[] }) => {
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
      });
  }
  getImage(path: string) {
    return `http://localhost:3000/${path}`;
  }
  onClickDelete(element: Element) {
    this.renderer.addClass(element, 'show-modal');
  }
  onCancel(element: Element) {
    this.renderer.removeClass(element, 'show-modal');
  }
  deleteWishItem(itemId: string) {
    this.productService.deleteWishListItem(itemId).subscribe((result) => {
      console.log(result);
    });
  }
}
