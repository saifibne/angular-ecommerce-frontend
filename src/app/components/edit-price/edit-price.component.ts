import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDataService } from '../../services/userData.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDataService } from '../../services/productData.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-price',
  templateUrl: './edit-price.component.html',
  styleUrls: [
    './edit-price.component.css',
    '../signup-form/signup-form.component.css',
  ],
})
export class EditPriceComponent implements OnInit, OnDestroy {
  productId: string;
  subscription: Subscription;
  isUpdating = false;
  @ViewChild('form') form: NgForm;
  constructor(
    private userService: UserDataService,
    private route: ActivatedRoute,
    private productService: ProductDataService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userService.showHeader.next(false);
    this.userService.showFooter.next(false);
    this.productId = this.route.snapshot.params['productId'];
    this.subscription = this.productService
      .getProductPrice(this.productId)
      .subscribe(
        (result) => {
          if (result) {
            this.form.setValue({
              offerPrice: result.product.offerPrice,
              originalPrice: result.product.originalPrice,
            });
          } else {
            return this.router.navigate(['/user/login']);
          }
        },
        () => {
          return this.router.navigate(['/user/login']);
        }
      );
  }
  onSubmit(form: NgForm) {
    this.isUpdating = true;
    this.productService
      .postPriceUpdate(
        this.productId,
        form.value.offerPrice,
        form.value.originalPrice
      )
      .subscribe(() => {
        this.isUpdating = false;
        return this.router.navigate(['/']);
      });
  }
  ngOnDestroy() {
    this.userService.showHeader.next(true);
    this.userService.showFooter.next(true);
    this.subscription.unsubscribe();
  }
}
