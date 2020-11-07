import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ProductFormComponent } from './components/product-form/product-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { CategoryProductComponent } from './components/category-products/category-product.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { WishlistItemsComponent } from './components/wishlist-items/wishlist-items.component';
import { OrderComponent } from './components/order/order.component';
import { CanActivateClass } from './services/canActivate.guard';

const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [CanActivateClass],
  },
  {
    path: 'product/:category/:productId',
    component: ProductPageComponent,
  },
  { path: 'products/:category', component: CategoryProductComponent },
  { path: 'search', component: CategoryProductComponent },
  {
    path: 'add-product',
    component: ProductFormComponent,
    canActivate: [CanActivateClass],
  },
  {
    path: 'cart',
    component: CartPageComponent,
    canActivate: [CanActivateClass],
  },
  { path: 'signup', component: SignupFormComponent },
  { path: 'login', component: LoginFormComponent },
  {
    path: 'wishlist',
    component: WishlistItemsComponent,
    canActivate: [CanActivateClass],
  },
  { path: 'order', component: OrderComponent, canActivate: [CanActivateClass] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
