import { NgModule } from '@angular/core';
import { ProductFormComponent } from '../components/product-form/product-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';
import { CanActivateClass } from '../services/canActivate.guard';
import { FormDeactivateGuard } from '../services/formDeactivate.guard';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ProductFormComponent],
  imports: [
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    ReactiveFormsModule,
    // RouterModule.forChild([
    //   {
    //     path: '',
    //     component: ProductFormComponent,
    //     canActivate: [CanActivateClass],
    //     canDeactivate: [FormDeactivateGuard],
    //   },
    // ]),
    RouterModule,
    SharedModule,
  ],
})
export class ProductAddModule {}
