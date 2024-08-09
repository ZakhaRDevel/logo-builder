import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl, UntypedFormArray} from '@angular/forms';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {FormInput} from '../../../abstract/form-input.abstract';

@Component({
  selector: 'app-input-files',
  standalone: true,
  imports: [NgOptimizedImage, NgClass],
  templateUrl: './input-files.component.html',
  styleUrl: './input-files.component.scss',
})
export class InputFilesComponent extends FormInput {
  @Input() color: 'mint-light' | 'blue50' = 'mint-light';
  @Input() text: string;
  @Input() option: string;
  @Input() control: UntypedFormArray = new UntypedFormArray([]);
  @Input() maxSize: number = 5000000;
  @Input() allowedFormats: string[] = ['image/jpeg', 'image/png', 'application/pdf'];
  @Input() maxFiles: number = 5;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  errorMessages: string[] = [];

  @Output() onFileDelete: EventEmitter<number> = new EventEmitter<number>();
  @Output() onFileAdd: EventEmitter<FileList> = new EventEmitter<FileList>();

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.addFilesToFormArray(files);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.files) {
      return;
    }
    const files: FileList = event.dataTransfer.files;
    this.addFilesToFormArray(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private addFilesToFormArray(files: FileList): void {
    this.errorMessages = [];
    if (this.control.length + files.length > this.maxFiles) {
      this.errorMessages.push(`Максимальна кількість файлів: ${this.maxFiles}`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (!this.allowedFormats.includes(file.type)) {
          this.errorMessages.push(`Неприпустимий формат файлу: ${file.name}`);
          continue;
        }
        if (file.size > this.maxSize) {
          this.errorMessages.push(`Файл занадто великий: ${file.name}`);
          continue;
        }
        this.control.push(new FormControl(file));
      }

      this.onFileAdd.emit(this.control.value);
    }
  }

  removeFile(index: number): void {
    if (this.control.at(index).value.id) {
      this.onFileDelete.emit(this.control.at(index).value.id);
    }
    this.control.removeAt(index);
    this.control.markAsUntouched();
    this.errorMessages = [];
  }
}
