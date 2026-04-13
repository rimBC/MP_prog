import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  imports:[CommonModule]
})
export class ModalComponent {

  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  closeOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('absolute')) {
      this.closeModal();
    }
  }
}