import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-icon',
  standalone: true,
  imports: [],
  templateUrl: './arrow-icon.component.svg',
})
export class ArrowIconComponent {
  @Input() width: number = 11;
  @Input() height: number = 18;
}
