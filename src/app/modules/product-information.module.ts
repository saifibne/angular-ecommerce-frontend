import { NgModule } from '@angular/core';
import { EditPriceComponent } from '../components/edit-price/edit-price.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared.module';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CanActivateClass } from '../services/canActivate.guard';

@NgModule({
  declarations: [EditPriceComponent],
  imports: [
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'edit-price/:productId',
        component: EditPriceComponent,
        canActivate: [CanActivateClass],
      },
    ]),
    MatProgressSpinnerModule,
  ],
})
export class ProductInformationModule {}
