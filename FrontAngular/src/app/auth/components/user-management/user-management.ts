import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SignUpRequest, SignUpResponse } from '../../../models/signUp.interface';


@Component({
  selector: 'app-user-management',
  imports: [ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit{
  
  createUserForm!: FormGroup;
  loading = false;
  submitted = false;
  success: string | null = null;
  error: string | null = null;
  showPassword = false;
  loginAvailable = true;
  checkingAvailability = false;
 
  roles: Role[] = [
    { id: 1, name: 'SIMPLE_UTILISATEUR', description: 'Simple User - Basic access' },
    { id: 2, name: 'RESPONSABLE', description: 'Manager - Reports and statistics' },
    { id: 3, name: 'ADMINISTRATEUR', description: 'Administrator - Full access' }
  ];
 
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }
 
  ngOnInit(): void {
    this.initializeForm();
  }
 
  /**
   * Initialize the form
   */
  private initializeForm(): void {
    this.createUserForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
 
  /**
   * Custom validator for password matching
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const passwordConfirm = group.get('passwordConfirm');
 
    if (!password || !passwordConfirm) {
      return null;
    }
 
    return password.value === passwordConfirm.value ? null : { passwordMismatch: true };
  }
 
  /**
   * Check if login is available
   */
  checkLoginAvailability(): void {
    const login = this.createUserForm.get('login')?.value;
 
    if (!login || login.length < 3) {
      return;
    }
 
    this.checkingAvailability = true;
    this.authService.checkLoginAvailability(login).subscribe({
      next: (response) => {
        this.loginAvailable = response.available;
        this.checkingAvailability = false;
      },
      error: (error) => {
        this.checkingAvailability = false;
        console.error('Error checking login availability:', error);
      }
    });
  }
 
  /**
   * Submit form to create user
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;
 
    if (this.createUserForm.invalid || !this.loginAvailable) {
      return;
    }
 
    this.loading = true;
    const request: SignUpRequest = {
      login: this.createUserForm.get('login')?.value,
      password: this.createUserForm.get('password')?.value,
      passwordConfirm: this.createUserForm.get('passwordConfirm')?.value,
      roleId: parseInt(this.createUserForm.get('roleId')?.value)
    };
 
    this.authService.createAdmin(request).subscribe({
      next: (response: SignUpResponse) => {
        this.loading = false;
        this.success = `User '${response.login}' created successfully with role '${response.role}'`;
        this.createUserForm.reset();
        this.submitted = false;
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.success = null;
        }, 5000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to create user. Please try again.';
      }
    });
  }
 
  /**
   * Get form controls
   */
  get f() {
    return this.createUserForm.controls;
  }
 
  /**
   * Get role description
   */
  getRoleDescription(roleId: string): string {
    const role = this.roles.find(r => r.id === parseInt(roleId));
    return role?.description || '';
  }
}
