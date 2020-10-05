import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ProductFormComponent } from './components/product-form/product-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { ProductResolverService } from './services/product-resolver.service';

const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'product/:category/:productId',
    component: ProductPageComponent,
    resolve: [ProductResolverService],
  },
  { path: 'add-product', component: ProductFormComponent },
  { path: 'signup', component: SignupFormComponent },
  { path: 'login', component: LoginFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
