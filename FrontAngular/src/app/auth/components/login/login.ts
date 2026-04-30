import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../../models/login.interface';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  returnUrl: string = '';
 
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
 
  ngOnInit(): void {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/Home';
 
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()==true) {
      this.router.navigate([this.returnUrl]);
    }
 
    // Initialize form
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
 
  /**
   * Submit login form
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = null;
 
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
 
    this.loading = true;
    const credentials: LoginRequest = this.loginForm.value;
 
    this.authService.login(credentials).subscribe({
      next: (response) => {
        alert("response received")
        // Redirect to appropriate dashboard based on role
        this.redirectByRole(response.role);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
 
  /**
   * Redirect user to role-specific dashboard
   */
  private redirectByRole(role: string): void {

    const dashboardMap: { [key: string]: string } = {
      'SIMPLE_UTILISATEUR': '/user/trainers',
      'RESPONSABLE': '/user/trainers',
      'ADMINISTRATEUR': '/user/trainers'
    };
 
    const dashboardUrl = dashboardMap[role] || '/dashboard';
    alert(dashboardUrl)

    this.router.navigate([dashboardUrl]);
  }
 
  /**
   * Get form controls
   */
  get f() {
    return this.loginForm.controls;
  }
}
