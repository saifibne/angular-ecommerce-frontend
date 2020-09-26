import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { ProductDataService } from '../../../services/productData.service';
import { ProductInterface } from '../../../models/product.model';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-slideshow',
  templateUrl: 'home-slideshow.component.html',
  styleUrls: ['home-slideshow.component.css'],
})
export class HomeSlideshowComponent implements OnInit {
  @Input('category') category: string;
  @ViewChild('slider') slider: ElementRef;
  nextIcon = faAngleRight;
  prevIcon = faAngleLeft;
  sliderVisibilityWidth;
  sliderBreakPoint;
  totalWidth;
  prevSliderWidth = 0;
  items = [];
  products: ProductInterface[] = [];
  constructor(
    private productDataService: ProductDataService,
    private elem: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this.productDataService
      .categoryData(this.category)
      .subscribe((products) => {
        this.products = products.productsData;
      });
  }
  getImagePath(product: ProductInterface) {
    return `http://localhost:3000/${product.imageUrls[0].path}`;
  }
  onClickNext() {
    this.items = this.elem.nativeElement.querySelectorAll('.slideshow-card');
    this.sliderVisibilityWidth = this.slider.nativeElement.offsetWidth;
    this.totalWidth = (this.items.length - 1) * 10;
    this.items.forEach((item) => {
      this.totalWidth += item.clientWidth;
    });
    for (const item of this.items) {
      if (
        item.offsetLeft + item.clientWidth >
        this.sliderVisibilityWidth + this.prevSliderWidth
      ) {
        this.sliderBreakPoint = item.offsetLeft;
        this.prevSliderWidth = item.offsetLeft;
        if (
          this.prevSliderWidth + this.sliderVisibilityWidth >
          this.totalWidth
        ) {
          this.renderer.setStyle(
            this.slider.nativeElement,
            'transform',
            `translateX(-${this.totalWidth - this.sliderVisibilityWidth}px)`
          );
          this.prevSliderWidth = this.totalWidth - this.sliderVisibilityWidth;
        } else {
          this.renderer.setStyle(
            this.slider.nativeElement,
            'transform',
            `translateX(-${this.sliderBreakPoint}px)`
          );
        }
        break;
      }
    }
  }
  onClickPrev() {
    this.items = this.elem.nativeElement.querySelectorAll('.slideshow-card');
    this.sliderVisibilityWidth = this.slider.nativeElement.offsetWidth;
    const array = [...this.items];
    const newArray = array.reverse();
    for (const item of newArray) {
      if (this.prevSliderWidth > item.offsetLeft) {
        this.prevSliderWidth =
          item.offsetLeft - this.sliderVisibilityWidth + item.clientWidth;
        if (this.prevSliderWidth > 0) {
          this.renderer.setStyle(
            this.slider.nativeElement,
            'transform',
            `translateX(-${
              item.offsetLeft - this.sliderVisibilityWidth + item.clientWidth
            }px)`
          );
        } else {
          this.renderer.setStyle(
            this.slider.nativeElement,
            'transform',
            `translateX(0)`
          );
          this.prevSliderWidth = 0;
        }
        break;
      }
    }
  }
}
