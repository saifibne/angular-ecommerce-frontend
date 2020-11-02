import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[accountDropdown]',
})
export class AccountDropdownDirective {
  constructor(private element: ElementRef, private renderer: Renderer2) {}
  @HostListener('mouseenter') onHover() {
    this.renderer.addClass(
      this.element.nativeElement.childNodes[1],
      'account-dropdown__show'
    );
  }
  @HostListener('mouseleave') onHoverOut() {
    this.renderer.removeClass(
      this.element.nativeElement.childNodes[1],
      'account-dropdown__show'
    );
  }
}
