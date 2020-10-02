import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { ProductDataService } from '../../../services/productData.service';
import { ProductInterface } from '../../../models/product.model';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-slideshow',
  templateUrl: 'home-slideshow.component.html',
  styleUrls: ['home-slideshow.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSlideshowComponent implements OnInit, AfterViewInit {
  @Input('category') category: string;
  @ViewChild('slider') slider: ElementRef;
  nextIcon = faAngleRight;
  prevIcon = faAngleLeft;
  sliderVisibilityWidth: number;
  sliderBreakPoint;
  totalWidth = 0;
  prevSliderWidth = 0;
  scrollBarWrapperWidth;
  scrollBar: number;
  items = [];
  products: ProductInterface[] = [];
  constructor(
    private productDataService: ProductDataService,
    private elem: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {}
  ngAfterViewInit() {
    this.scrollBarWrapperWidth = this.elem.nativeElement.querySelector(
      '.feed-scroll'
    ).offsetWidth;
    this.sliderVisibilityWidth = this.slider.nativeElement.offsetWidth;
    this.productDataService
      .categoryData(this.category)
      .subscribe((products) => {
        this.products = products.productsData;
        this.cd.detectChanges();
        this.items = this.elem.nativeElement.querySelectorAll(
          '.slideshow-card'
        );
        // change set timeout to work the total width properly TODO: replace setTimeOut()
        const completeInterval = setInterval(() => {
          if (document.readyState === 'complete') {
            this.totalWidth = (this.items.length - 1) * 10;
            this.items.forEach((item) => {
              this.totalWidth += item.clientWidth;
            });
            this.scrollBarWidth();
            clearInterval(completeInterval);
          }
        }, 100);
      });
  }

  @HostListener('window:resize') changeScrollWidth() {
    this.scrollBarWrapperWidth = this.elem.nativeElement.querySelector(
      '.feed-scroll'
    ).offsetWidth;
    this.sliderVisibilityWidth = this.slider.nativeElement.offsetWidth;
    this.scrollBarWidth();
  }
  getImagePath(product: ProductInterface) {
    return `http://localhost:3000/${product.imageUrls[0].path}`;
  }
  onClickNext() {
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
        this.scrollBarMove();
        break;
      }
    }
  }
  onClickPrev() {
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
        this.scrollBarMove();
        break;
      }
    }
  }
  scrollBarWidth() {
    this.scrollBar = +(
      this.scrollBarWrapperWidth /
      (this.totalWidth / this.sliderVisibilityWidth)
    ).toFixed(3);
    const scrollBarElement = this.elem.nativeElement.querySelector(
      '.scroll-bar'
    );
    this.renderer.setStyle(scrollBarElement, 'width', `${this.scrollBar}px`);
  }
  scrollBarMove() {
    const viewedPercentage =
      ((this.prevSliderWidth + this.sliderVisibilityWidth) / this.totalWidth) *
      100;
    const viewedPercentageInSliderWidth: number = +(
      (viewedPercentage / 100) *
      this.sliderVisibilityWidth
    ).toFixed(3);
    const width = viewedPercentageInSliderWidth - this.scrollBar;
    const scrollBarElement = this.elem.nativeElement.querySelector(
      '.scroll-bar'
    );
    this.renderer.setStyle(
      scrollBarElement,
      'transform',
      `translateX(${width}px)`
    );
  }
}
