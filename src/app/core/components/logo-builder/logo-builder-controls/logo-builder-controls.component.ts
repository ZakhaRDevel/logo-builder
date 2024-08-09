import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LogoBuilderSelectComponent } from '../logo-builder-select/logo-builder-select.component';
import { LogoBuilderIconSelectorComponent } from '../logo-builder-icon-selector/logo-builder-icon-selector.component';
import { LogoBuilderBackgroundSelectorComponent } from '../logo-builder-background-selector/logo-builder-background-selector.component';

@Component({
  selector: 'app-logo-builder-controls',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectModule,
    LogoBuilderSelectComponent,
    LogoBuilderIconSelectorComponent,
    LogoBuilderBackgroundSelectorComponent,
  ],
  templateUrl: './logo-builder-controls.component.html',
  styleUrls: ['./logo-builder-controls.component.scss'],
})
export class LogoBuilderControlsComponent {
  @Output() iconChange = new EventEmitter<string>();
  @Output() textChange = new EventEmitter<string>();
  @Output() textColorChange = new EventEmitter<string>();
  @Output() backgroundColorChange = new EventEmitter<string>();
  @Output() backgroundImageChange = new EventEmitter<File>();
  @Output() iconBackgroundImageChange = new EventEmitter<File>();
  @Output() iconColorChange = new EventEmitter<string>();
  @Output() heightChange = new EventEmitter<number>();
  @Output() widthChange = new EventEmitter<number>();
  @Output() formatChange = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();

  icon: string = '/assets/icons/default-icon.svg';
  text: string = 'Some test text';
  backgroundColor: string = '#ffffff';
  iconBackgroundColor: string = '#0070CE';
  textColor: string = '#000000';
  height: number = 420;
  width: number = 768;
  format: string = 'PNG';

  onIconChange(icon: string) {
    this.icon = icon;
    this.iconChange.emit(this.icon);
  }

  onHeightChange(event: Event) {
    this.heightChange.emit(this.height);
  }

  onWidthChange(event: Event) {
    this.widthChange.emit(this.width);
  }

  onTextInputChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.text = input.value;
      this.textChange.emit(this.text);
    }
  }

  onBackgroundColorChange(color: string) {
    if (color) {
      this.backgroundColor = color;
      this.backgroundColorChange.emit(this.backgroundColor);
    }
  }

  onTextColorChange(color: string) {
    if (color) {
      this.textColor = color;
      this.textColorChange.emit(this.textColor);
    }
  }

  onBackgroundImageChange(file: File) {
    if (file) {
      this.backgroundImageChange.emit(file);
    }
  }

  onIconBackgroundImageChange(file: File) {
    this.iconBackgroundImageChange.emit(file);
  }

  onIconColorChange(color: string) {
    this.iconColorChange.emit(color);
  }

  onFormatChange(format: string) {
    this.format = format;
    this.formatChange.emit(this.format);
  }
}
