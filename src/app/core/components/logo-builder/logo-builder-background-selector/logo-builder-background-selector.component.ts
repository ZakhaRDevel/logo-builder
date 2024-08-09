import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ColorEvent} from 'ngx-color';
import {CloseIconComponent} from "../../../svg/close-icon/close-icon.component";
import {InputFilesComponent} from "../../inputs/input-files/input-files.component";
import {ClickOutsideDirective} from "../../../directive/click-outside.directive";
import {IKeyValue} from "../../../interface/key-value";
import {TabsComponent} from "../../ui/tabs/tabs.component";


@Component({
  selector: 'app-logo-builder-background-selector',
  standalone: true,
  imports: [
    FormsModule,
    ColorSketchModule,
    TabsComponent,
    InputFilesComponent,
    ClickOutsideDirective,
    CloseIconComponent,
  ],
  templateUrl: './logo-builder-background-selector.component.html',
  styleUrl: './logo-builder-background-selector.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoBuilderBackgroundSelectorComponent {
  @Input() isImageChange: boolean = true;
  @Input() isColorChange: boolean = true;
  @Input() btnText: string;
  @Input() color: string = '';
  @Output() colorSelected = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<File>();
  activeTab: 'color' | 'image' = 'color';
  tabs: IKeyValue[] = [
    {
      label: 'Обрати колір',
      value: 'color',
    },
    {
      label: 'Завантажити картинку',
      value: 'image',
    },
  ];
  showModal: boolean = false;
  selectedImage: File | null = null;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onColorChange(color: ColorEvent) {
    const {r, g, b, a} = color.color.rgb;
    this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.colorSelected.emit(this.color);
  }

  onImageChange(files: FileList) {
    this.selectedImage = files[0];
    this.imageSelected.emit(this.selectedImage);
    this.closeModal();
  }
}
