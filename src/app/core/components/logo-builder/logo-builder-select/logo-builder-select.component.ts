import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logo-builder-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule],
  templateUrl: './logo-builder-select.component.html',
  styleUrl: './logo-builder-select.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoBuilderSelectComponent {
  @Output() change = new EventEmitter<string>();
  format: string = 'PNG';

  onFormatChange(format: string) {
    this.format = format;
    this.change.emit(this.format);
  }
}
