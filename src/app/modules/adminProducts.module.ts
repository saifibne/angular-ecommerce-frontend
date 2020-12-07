import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminProductsComponent } from '../components/admin-products/admin-products.component';
import { SearchArrayPipe } from '../pipes/searchArray.pipe';
import { SharedModule } from './shared.module';
import { CanActivateClass } from '../services/canActivate.guard';

@NgModule({
  declarations: [AdminProductsComponent, SearchArrayPipe],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'products',
        component: AdminProductsComponent,
        canActivate: [CanActivateClass],
      },
    ]),
  ],
})
export class AdminProductsModule {}
