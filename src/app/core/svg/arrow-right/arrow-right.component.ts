import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-right',
  templateUrl: './arrow-right.component.svg',
  standalone: true,
})
export class ArrowRightComponent {
  @Input() width: number = 32;
  @Input() height: number = 32;
}
