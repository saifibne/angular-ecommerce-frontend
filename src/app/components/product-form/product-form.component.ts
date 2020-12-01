import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ProductDataService } from '../../services/productData.service';
import { UserDataService } from '../../services/userData.service';
import { DeactivateInterface } from '../../services/formDeactivate.guard';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [
    './product-form.component.css',
    '../signup-form/signup-form.component.css',
  ],
})
export class ProductFormComponent
  implements OnInit, DeactivateInterface, OnDestroy {
  addIcon = faPlusCircle;
  cancelIcon = faTimesCircle;
  form: FormGroup;
  fileAsDataUrl: string | ArrayBuffer;
  fileData = [];
  submitted = false;
  constructor(
    private productDataService: ProductDataService,
    private router: Router,
    private userService: UserDataService
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      category: new FormControl('sofa', Validators.required),
      imageUrl: new FormArray([new FormControl(null, Validators.required)]),
    });
    this.userService.showHeader.next(false);
    this.userService.showFooter.next(false);
  }
  addImage() {
    const newControl = new FormControl(null, Validators.required);
    (<FormArray>this.form.get('imageUrl')).push(newControl);
  }
  get controls() {
    return (<FormArray>this.form.get('imageUrl')).controls;
  }
  individualControl(index) {
    return (<FormArray>this.form.get('imageUrl')).at(index) as FormControl;
  }
  fileChange(event, index: number) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType === 'image/jpeg' ||
        fileType === 'image/png' ||
        fileType === 'image/jpg' ||
        fileType === 'image/webp'
      ) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          const fileIndex = this.fileData.findIndex((object) => {
            return object.id === index;
          });
          if (fileIndex !== -1) {
            this.fileData[fileIndex] = {
              id: index,
              file: file,
              data: fileReader.result,
            };
          } else {
            this.fileData.push({
              id: index,
              file: file,
              data: fileReader.result,
            });
          }
        };
        this.fileReader(file);
        (<FormArray>this.form.get('imageUrl')).at(index).setErrors(null);
      } else {
        (<FormArray>this.form.get('imageUrl'))
          .at(index)
          .setErrors({ wrongExtension: true });
      }
    }
  }
  fileReader(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (result) => {
      this.fileAsDataUrl = result.target.result;
    };
  }
  clearControl(index: number) {
    (<FormArray>this.form.get('imageUrl')).removeAt(index);
    this.fileData.splice(index, 1);
    this.fileAsDataUrl = this.fileData[index - 1].data;
  }
  private clearFormArray() {
    while ((<FormArray>this.form.get('imageUrl')).controls.length !== 1) {
      (<FormArray>this.form.get('imageUrl')).removeAt(0);
    }
  }
  onSelectImage(image: { id: number; file: File; data: string | ArrayBuffer }) {
    this.fileAsDataUrl = image.data;
  }
  onSubmit() {
    this.submitted = false;
    const formData = new FormData();
    formData.append('name', this.form.get('name').value);
    formData.append('price', this.form.get('price').value);
    formData.append('description', this.form.get('description').value);
    formData.append('category', this.form.get('category').value);
    this.fileData.map((file) => {
      formData.append('imageUrl', file.file);
    });
    this.productDataService.submitProduct(formData).subscribe(
      (result) => {
        console.log(result);
        this.submitted = true;
        this.form.reset({
          category: 'sofa',
        });
        this.clearFormArray();
        this.fileData = [];
        this.fileAsDataUrl = null;
      },
      () => {
        return this.router.navigate(['login']);
      }
    );
  }
  canDeactivate() {
    if (this.submitted) {
      return true;
    } else if (
      this.form.get('name').value === null &&
      this.form.get('price').value === null &&
      this.form.get('description').value === null &&
      this.submitted === false
    ) {
      return true;
    } else {
      return confirm('Do you really want to leave?');
    }
  }
  ngOnDestroy() {
    this.userService.showHeader.next(true);
    this.userService.showFooter.next(true);
  }
}
