import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';
import {IKeyValue} from '../../../interface/key-value';
import {ClickOutsideDirective} from "../../../directive/click-outside.directive";
import {ArrowIconComponent} from "../../../svg/arrow-icon/arrow-icon.component";


@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    RouterLinkActive,
    ClickOutsideDirective,
    NgClass,
    ArrowIconComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit {
  @Input() tabs: IKeyValue[];
  @Input() isAll: boolean = true;
  @Input() variant: 'default' | 'semitransparent' | 'uppercase' = 'default';
  @Output() toggle = new EventEmitter();
  @Input() isMulti: boolean = true;
  @Input() activeTab?: IKeyValue;
  selectedItems: any[] = [];
  isOpen: boolean = false;

  ngOnInit(): void {
    if (this.activeTab) {
      this.toggleItem(this.activeTab);
    }
  }

  toggleItem(item: IKeyValue) {
    const itemValue = item.value;

    if (this.isMulti) {
      const index = this.selectedItems.indexOf(itemValue);

      if (index !== -1) {
        this.selectedItems.splice(index, 1);
        if (this.selectedItems.length === 0 && this.tabs.length === 1) {
          this.selectedItems = [];
        }
      } else {
        this.selectedItems.push(itemValue);
        if (
          this.selectedItems.length === this.tabs.length &&
          this.tabs.every((tab: any) => this.selectedItems.includes(tab.value))
        ) {
          this.selectedItems = [];
        }
      }
    } else {
      if (!this.selectedItems.includes(itemValue)) {
        this.selectedItems = [itemValue];
      }
    }

    this.toggle.emit({items: this.selectedItems, item: itemValue});
  }

  onClear() {
    this.selectedItems = [];
    this.toggle.emit({items: this.selectedItems, item: -1});
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
