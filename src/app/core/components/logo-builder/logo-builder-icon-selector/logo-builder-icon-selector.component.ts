import {Component, EventEmitter, Output} from '@angular/core';
import {CloseIconComponent} from "../../../svg/close-icon/close-icon.component";
import {ClickOutsideDirective} from "../../../directive/click-outside.directive";


@Component({
  selector: 'app-logo-builder-icon-selector',
  standalone: true,
  imports: [CloseIconComponent, ClickOutsideDirective],
  templateUrl: './logo-builder-icon-selector.component.html',
  styleUrl: './logo-builder-icon-selector.component.scss',
})
export class LogoBuilderIconSelectorComponent {
  @Output() iconSelected = new EventEmitter<string>();
  showModal: boolean = false;
  icons: string[] = [
    'assets/img/icons/exportbrand/icon-2.svg',
    'assets/img/icons/exportbrand/icon-3.svg',
    'assets/img/icons/exportbrand/icon-4.svg',
    'assets/img/icons/exportbrand/icon-5.svg',
    'assets/img/icons/exportbrand/icon-6.svg',
    'assets/img/icons/exportbrand/icon-7.svg',
    'assets/img/icons/exportbrand/icon-8.svg',
    'assets/img/icons/exportbrand/icon-9.svg',
    'assets/img/icons/exportbrand/icon-10.svg',
    'assets/img/icons/exportbrand/icon-11.svg',
    'assets/img/icons/exportbrand/icon-12.svg',
    'assets/img/icons/exportbrand/icon-13.svg',
    'assets/img/icons/exportbrand/icon-14.svg',
    'assets/img/icons/exportbrand/icon-15.svg',
    'assets/img/icons/exportbrand/icon-16.svg',
    'assets/img/icons/exportbrand/icon-17.svg',
    'assets/img/icons/exportbrand/icon-18.svg',
    'assets/img/icons/exportbrand/icon-19.svg',
    'assets/img/icons/exportbrand/icon-20.svg',
    'assets/img/icons/exportbrand/icon-21.svg',
    'assets/img/icons/exportbrand/icon-22.svg',
    'assets/img/icons/exportbrand/icon-23.svg',
    'assets/img/icons/exportbrand/icon-24.svg',
  ];

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  selectIcon(iconPath: string) {
    this.iconSelected.emit(iconPath);
    this.closeModal();
  }
}
