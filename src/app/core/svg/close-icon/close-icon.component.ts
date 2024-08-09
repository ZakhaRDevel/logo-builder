import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-close-icon',
  standalone: true,
  imports: [],
  templateUrl: './close-icon.component.svg',
})
export class CloseIconComponent {
  @Input() width: number = 32;
  @Input() height: number = 32;
}
