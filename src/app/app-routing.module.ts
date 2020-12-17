import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ProductFormComponent } from './components/product-form/product-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CategoryProductComponent } from './components/category-products/category-product.component';
import { CanActivateClass } from './services/canActivate.guard';
import { FormDeactivateGuard } from './services/formDeactivate.guard';

const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/adminProducts.module').then(
        (m) => m.AdminProductsModule
      ),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./modules/productPage.module').then((m) => m.ProductPageModule),
  },
  // {
  //   path: 'add-product',
  //   loadChildren: () =>
  //     import('./modules/productAdd.module').then((m) => m.ProductAddModule),
  // },
  {
    path: 'add-product',
    component: ProductFormComponent,
    canActivate: [CanActivateClass],
    canDeactivate: [FormDeactivateGuard],
  },
  {
    path: 'information',
    loadChildren: () =>
      import('./modules/product-information.module').then(
        (m) => m.ProductInformationModule
      ),
  },
  { path: 'products/:category', component: CategoryProductComponent },
  { path: 'search', component: CategoryProductComponent },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/login-signup.module').then((m) => m.LoginSignupModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/orderPackage.module').then((m) => m.OrderPackageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
