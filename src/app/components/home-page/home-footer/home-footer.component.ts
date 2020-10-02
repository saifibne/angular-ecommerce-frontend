import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFooterComponent {}
