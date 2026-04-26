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
import { Role } from '../../../../core/services/user.service';
import { UtilisateurDTO } from '../../../../models/user.interface';

export interface UserFormPayload {
  login: string;
  role: string;
  roleId: number;
  actif: boolean;
  // Only present in create mode.
  password?: string;
  passwordConfirm?: string;
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.css',
})
export class UserModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() roles: Role[] = [];
  @Input() user: UtilisateurDTO | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ data: UserFormPayload; editingId: number | null }>();

  form!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.applyUserToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;

    if (changes['user']) {
      this.applyUserToForm();
      this.submitted = false;
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.applyUserToForm();
      this.submitted = false;
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
      role: ['', Validators.required],
      actif: [true],
      password: [''],
      passwordConfirm: [''],
    });
  }

  private applyUserToForm(): void {
    if (this.user) {
      this.form.patchValue({
        login: this.user.login,
        role: this.user.roleName ?? '',
        actif: this.user.actif,
        password: '',
        passwordConfirm: '',
      });
      this.form.get('login')?.disable();
      this.form.get('password')?.clearValidators();
      this.form.get('passwordConfirm')?.clearValidators();
    } else {
      this.form.reset({ login: '', role: '', actif: true, password: '', passwordConfirm: '' });
      this.form.get('login')?.enable();
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.form.get('passwordConfirm')?.setValidators([Validators.required]);
    }
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('passwordConfirm')?.updateValueAndValidity();
  }

  get f() {
    return this.form.controls;
  }

  get isEditing(): boolean {
    return !!this.user;
  }

  get title(): string {
    return this.isEditing ? 'Edit User' : 'Add New User';
  }

  getRoleDisplay(role: string): string {
    const roleMap: { [key: string]: string } = {
      SIMPLE_UTILISATEUR: 'Simple User',
      RESPONSABLE: 'Manager',
      ADMINISTRATEUR: 'Administrator',
    };
    return roleMap[role] || role;
  }

  submitForm(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    if (!this.isEditing && value.password !== value.passwordConfirm) {
      this.form.get('passwordConfirm')?.setErrors({ mismatch: true });
      return;
    }

    const role = this.roles.find(r => r.nom === value.role);

    this.saved.emit({
      data: {
        login: value.login,
        role: value.role,
        roleId: role?.id ?? 0,
        actif: !!value.actif,
        password: this.isEditing ? undefined : value.password,
        passwordConfirm: this.isEditing ? undefined : value.passwordConfirm,
      },
      editingId: this.user?.id ?? null,
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
