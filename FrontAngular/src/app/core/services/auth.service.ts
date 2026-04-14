import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginRequest,LoginResponse } from '../../models/login.interface';
import { User } from '../../models/user.interface';
import { SignUpRequest, SignUpResponse } from '../../models/signUp.interface';





@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Load user from localStorage on app init
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.clearStorage();
      }
    }
  }

  /**
   * Login user with credentials
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
      const test: LoginResponse = {
    actif: true,
    id: 8,
    login: "admin",
    refreshToken: "eyJhbGciOiJIUzUxMiJ9...",
    role: credentials.login,
    token: "eyJhbGciOiJIUzUxMiJ9...",
    type: "bearer"
  }; 
   const userData: User = {
            id: 8,
            login: "admin",
            role:  credentials.login,
            actif: true
          };

  this.storeUser(userData);
          this.currentUserSubject.next(userData);
          this.isAuthenticatedSubject.next(true);
  return of(test);
    // return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
    //   .pipe(
    //     tap(response => {
    //       this.storeToken(response.token);
    //       this.storeRefreshToken(response.refreshToken);
    //       const userData: User = {
    //         id: response.id,
    //         login: response.login,
    //         role: response.role,
    //         actif: response.actif
    //       };
    //       this.storeUser(userData);
    //       this.currentUserSubject.next(userData);
    //       this.isAuthenticatedSubject.next(true);
    //     }),
    //     catchError(error => {
    //       console.error('Login failed:', error);
    //       return throwError(() => error);
    //     })
    //   );
  }

  /**
   * Create admin user (admin only)
   */
  createAdmin(request: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.apiUrl}/create-admin`, request)
      .pipe(
        catchError(error => {
          console.error('Admin creation failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Sign up new user
   */
  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.apiUrl}/signup`, request)
      .pipe(
        catchError(error => {
          console.error('Sign up failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Check if login is available
   */
  checkLoginAvailability(login: string): Observable<{ login: string; available: boolean; message: string }> {
    return this.http.get<{ login: string; available: boolean; message: string }>(
      `${this.apiUrl}/check-availability/${login}`
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refresh token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh?refreshToken=${refreshToken}`, {})
      .pipe(
        tap(response => {
          this.storeToken(response.token);
          this.storeRefreshToken(response.refreshToken);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user role
   */
  getCurrentRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const currentRole = this.getCurrentRole();
    return currentRole === role;
  }

  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roles: string[]): boolean {
    const currentRole = this.getCurrentRole();
    return currentRole ? roles.includes(currentRole) : false;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const userData: User = {
            id: 8,
            login: "admin",
            role:  "ADMINISTRATEUR",
            actif: true
          };

  this.storeUser(userData);
          this.currentUserSubject.next(userData);
    return true
  //  return this.isAuthenticatedSubject.value;
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Store token in localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Store refresh token in localStorage
   */
  private storeRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Store user in localStorage
   */
  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear all stored data
   */
  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}