import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CartPageComponent } from '../components/cart-page/cart-page.component';
import { WishlistItemsComponent } from '../components/wishlist-items/wishlist-items.component';
import { OrderComponent } from '../components/order/order.component';
import { SharedModule } from './shared.module';
import { CanActivateClass } from '../services/canActivate.guard';

@NgModule({
  declarations: [CartPageComponent, WishlistItemsComponent, OrderComponent],
  imports: [
    RouterModule.forChild([
      {
        path: 'cart',
        component: CartPageComponent,
        canActivate: [CanActivateClass],
      },
      {
        path: 'wishlist',
        component: WishlistItemsComponent,
        canActivate: [CanActivateClass],
      },
      {
        path: 'order',
        component: OrderComponent,
        canActivate: [CanActivateClass],
      },
    ]),
    SharedModule,
  ],
})
export class OrderPackageModule {}
