import { NgModule } from '@angular/core';
import { ProductPageComponent } from '../components/product-page/product-page.component';
import { SharedModule } from './shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductPageComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: ':category/:productId',
        component: ProductPageComponent,
      },
    ]),
  ],
})
export class ProductPageModule {}
