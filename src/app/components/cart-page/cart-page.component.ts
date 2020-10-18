import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/userData.service';
import { MappedCartInterface } from '../../models/cart.model';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartItems: MappedCartInterface;
  isUserLogIn: boolean;
  constructor(private userService: UserDataService) {}
  ngOnInit() {
    this.userService.userLogInObs.subscribe((result) => {
      this.isUserLogIn = result;
    });
    this.userService
      .getCart()
      .subscribe((result: { message: string; cart: MappedCartInterface }) => {
        if (result !== null) {
          this.cartItems = result.cart;
        }
      });
  }
  getImageUrl(path) {
    return `http://localhost:3000/${path}`;
  }
}
