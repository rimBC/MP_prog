import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ConfigEntity {
  id?: number;
  libelle: string;
  description?: string;
  lieu?: string;
}

@Component({
  selector: 'app-config-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-modal.html',
  styleUrl: './config-modal.css',
})
export class ConfigModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() tabName: string = 'Item';
  @Input() showLieu = false;
  @Input() entity: ConfigEntity | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ data: ConfigEntity; editingId: number | null }>();

  form!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyEntityToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;

    if (changes['entity']) {
      this.applyEntityToForm();
      this.submitted = false;
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.applyEntityToForm();
      this.submitted = false;
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      lieu: [''],
    });
  }

  private applyEntityToForm(): void {
    if (this.entity) {
      this.form.patchValue({
        libelle: this.entity.libelle || '',
        description: this.entity.description || '',
        lieu: this.entity.lieu || '',
      });
    } else {
      this.form.reset({ libelle: '', description: '', lieu: '' });
    }
  }

  get f() {
    return this.form.controls;
  }

  get isEditing(): boolean {
    return !!this.entity?.id;
  }

  get title(): string {
    return `${this.isEditing ? 'Edit' : 'Add'} ${this.tabName}`;
  }

  submitForm(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const value = this.form.value;
    const data: ConfigEntity = {
      libelle: value.libelle,
      description: value.description || '',
    };
    if (this.showLieu) {
      data.lieu = value.lieu || '';
    }

    this.saved.emit({
      data,
      editingId: this.entity?.id ?? null,
    });
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['backdrop'] === 'true') {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }
}
