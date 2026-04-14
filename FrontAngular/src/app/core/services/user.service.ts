import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Role {
  id: number;
  nom: string;
}

export interface UtilisateurDTO {
  id: number;
  login: string;
  role: string;
  actif: boolean;
}

export interface ChangeRoleRequest {
  roleId: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:8080/api/utilisateurs';
  
  private utilisateursSubject = new BehaviorSubject<UtilisateurDTO[]>([]);
  public utilisateurs$ = this.utilisateursSubject.asObservable();
  
  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();
  
  // ==================== TEST DATA ====================
  private mockRoles: Role[] = [
    { id: 1, nom: 'SIMPLE_UTILISATEUR' },
    { id: 2, nom: 'RESPONSABLE' },
    { id: 3, nom: 'ADMINISTRATEUR' }
  ];
  
  private mockUtilisateurs: UtilisateurDTO[] = [
    {
      id: 1,
      login: 'admin',
      role: 'ADMINISTRATEUR',
      actif: true
    },
    {
      id: 2,
      login: 'user1',
      role: 'SIMPLE_UTILISATEUR',
      actif: true
    },
    {
      id: 3,
      login: 'manager1',
      role: 'RESPONSABLE',
      actif: true
    },
    {
      id: 4,
      login: 'user2',
      role: 'SIMPLE_UTILISATEUR',
      actif: true
    },
    {
      id: 5,
      login: 'john_doe',
      role: 'SIMPLE_UTILISATEUR',
      actif: false
    },
    {
      id: 6,
      login: 'jane_smith',
      role: 'RESPONSABLE',
      actif: true
    },
    {
      id: 7,
      login: 'bob_trainer',
      role: 'SIMPLE_UTILISATEUR',
      actif: true
    }
  ];
  
  private useTestData = true; // Set to false to use real API

  constructor(private http: HttpClient) {
    this.loadRoles();
    this.loadUtilisateurs();
  }

  // ==================== ROLES ====================

  /**
   * Get all available roles
   */
  getRoles(): Observable<Role[]> {
    if (this.useTestData) {
      this.rolesSubject.next(this.mockRoles);
      return of([...this.mockRoles]);
    }
    
    return this.http.get<Role[]>(`${this.apiUrl}/roles`)
      .pipe(
        tap(data => this.rolesSubject.next(data)),
        catchError(error => {
          console.error('Error loading roles:', error);
          // Fallback to test data on error
          this.rolesSubject.next(this.mockRoles);
          return of([...this.mockRoles]);
        })
      );
  }

  /**
   * Load roles into state
   */
  loadRoles(): void {
    this.getRoles().subscribe();
  }

  /**
   * Get current roles state
   */
  getCurrentRoles(): Role[] {
    return this.rolesSubject.value;
  }

  // ==================== UTILISATEURS ====================

  /**
   * Get all users
   */
  getUtilisateurs(): Observable<UtilisateurDTO[]> {
    if (this.useTestData) {
      this.utilisateursSubject.next(this.mockUtilisateurs);
      return of([...this.mockUtilisateurs]);
    }
    
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}`)
      .pipe(
        tap(data => this.utilisateursSubject.next(data)),
        catchError(error => {
          console.error('Error loading users:', error);
          this.utilisateursSubject.next(this.mockUtilisateurs);
          return of([...this.mockUtilisateurs]);
        })
      );
  }

  /**
   * Load users into state
   */
  loadUtilisateurs(): void {
    this.getUtilisateurs().subscribe();
  }

  /**
   * Get user by ID
   */
  getUtilisateurById(id: number): Observable<UtilisateurDTO> {
    if (this.useTestData) {
      const user = this.mockUtilisateurs.find(u => u.id === id);
      if (user) {
        return of({ ...user });
      }
      return of({} as UtilisateurDTO);
    }
    
    return this.http.get<UtilisateurDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error loading user:', error);
          const user = this.mockUtilisateurs.find(u => u.id === id);
          return of(user || {} as UtilisateurDTO);
        })
      );
  }

  /**
   * Get user by login
   */
  getUtilisateurByLogin(login: string): Observable<UtilisateurDTO> {
    if (this.useTestData) {
      const user = this.mockUtilisateurs.find(u => u.login === login);
      if (user) {
        return of({ ...user });
      }
      return of({} as UtilisateurDTO);
    }
    
    return this.http.get<UtilisateurDTO>(`${this.apiUrl}/login/${login}`)
      .pipe(
        catchError(error => {
          console.error('Error loading user by login:', error);
          const user = this.mockUtilisateurs.find(u => u.login === login);
          return of(user || {} as UtilisateurDTO);
        })
      );
  }

  /**
   * Change user role
   */
  changeUserRole(userId: number, roleId: number): Observable<UtilisateurDTO> {
    if (this.useTestData) {
      const user = this.mockUtilisateurs.find(u => u.id === userId);
      const role = this.mockRoles.find(r => r.id === roleId);
      
      if (user && role) {
        user.role = role.nom;
        // Update in state
        const current = this.utilisateursSubject.value;
        const index = current.findIndex(u => u.id === userId);
        if (index !== -1) {
          current[index] = { ...user };
          this.utilisateursSubject.next([...current]);
        }
        return of({ ...user });
      }
      return of({} as UtilisateurDTO);
    }
    
    const request: ChangeRoleRequest = { roleId };
    return this.http.put<UtilisateurDTO>(`${this.apiUrl}/${userId}/role/${roleId}`, request)
      .pipe(
        tap(updated => {
          const current = this.utilisateursSubject.value;
          const index = current.findIndex(u => u.id === userId);
          if (index !== -1) {
            current[index] = updated;
            this.utilisateursSubject.next([...current]);
          }
        }),
        catchError(error => {
          console.error('Error changing user role:', error);
          // Fallback to updating test data
          const user = this.mockUtilisateurs.find(u => u.id === userId);
          const role = this.mockRoles.find(r => r.id === roleId);
          if (user && role) {
            user.role = role.nom;
            return of({ ...user });
          }
          return of({} as UtilisateurDTO);
        })
      );
  }

  /**
   * Activate user
   */
  activateUser(userId: number): Observable<UtilisateurDTO> {
    if (this.useTestData) {
      const user = this.mockUtilisateurs.find(u => u.id === userId);
      if (user) {
        user.actif = true;
        // Update in state
        const current = this.utilisateursSubject.value;
        const index = current.findIndex(u => u.id === userId);
        if (index !== -1) {
          current[index] = { ...user };
          this.utilisateursSubject.next([...current]);
        }
        return of({ ...user });
      }
      return of({} as UtilisateurDTO);
    }
    
    return this.http.post<UtilisateurDTO>(`${this.apiUrl}/${userId}/activate`, {})
      .pipe(
        tap(updated => {
          const current = this.utilisateursSubject.value;
          const index = current.findIndex(u => u.id === userId);
          if (index !== -1) {
            current[index] = updated;
            this.utilisateursSubject.next([...current]);
          }
        }),
        catchError(error => {
          console.error('Error activating user:', error);
          const user = this.mockUtilisateurs.find(u => u.id === userId);
          if (user) {
            user.actif = true;
            return of({ ...user });
          }
          return of({} as UtilisateurDTO);
        })
      );
  }

  /**
   * Deactivate user
   */
  deactivateUser(userId: number): Observable<UtilisateurDTO> {
    if (this.useTestData) {
      const user = this.mockUtilisateurs.find(u => u.id === userId);
      if (user) {
        user.actif = false;
        // Update in state
        const current = this.utilisateursSubject.value;
        const index = current.findIndex(u => u.id === userId);
        if (index !== -1) {
          current[index] = { ...user };
          this.utilisateursSubject.next([...current]);
        }
        return of({ ...user });
      }
      return of({} as UtilisateurDTO);
    }
    
    return this.http.post<UtilisateurDTO>(`${this.apiUrl}/${userId}/deactivate`, {})
      .pipe(
        tap(updated => {
          const current = this.utilisateursSubject.value;
          const index = current.findIndex(u => u.id === userId);
          if (index !== -1) {
            current[index] = updated;
            this.utilisateursSubject.next([...current]);
          }
        }),
        catchError(error => {
          console.error('Error deactivating user:', error);
          const user = this.mockUtilisateurs.find(u => u.id === userId);
          if (user) {
            user.actif = false;
            return of({ ...user });
          }
          return of({} as UtilisateurDTO);
        })
      );
  }

  /**
   * Delete user
   */
  deleteUser(userId: number): Observable<void> {
    if (this.useTestData) {
      const current = this.utilisateursSubject.value;
      this.utilisateursSubject.next(current.filter(u => u.id !== userId));
      // Also remove from mock data
      const index = this.mockUtilisateurs.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.mockUtilisateurs.splice(index, 1);
      }
      return of(void 0);
    }
    
    return this.http.delete<void>(`${this.apiUrl}/${userId}`)
      .pipe(
        tap(() => {
          const current = this.utilisateursSubject.value;
          this.utilisateursSubject.next(current.filter(u => u.id !== userId));
        }),
        catchError(error => {
          console.error('Error deleting user:', error);
          // Fallback to removing from mock data
          const current = this.utilisateursSubject.value;
          this.utilisateursSubject.next(current.filter(u => u.id !== userId));
          return of(void 0);
        })
      );
  }

  /**
   * Get users by role
   */
  getUsersByRole(roleName: string): Observable<UtilisateurDTO[]> {
    if (this.useTestData) {
      const users = this.mockUtilisateurs.filter(u => u.role === roleName);
      return of([...users]);
    }
    
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/role/${roleName}`)
      .pipe(
        catchError(error => {
          console.error('Error loading users by role:', error);
          const users = this.mockUtilisateurs.filter(u => u.role === roleName);
          return of([...users]);
        })
      );
  }

  /**
   * Get active users
   */
  getActiveUsers(): Observable<UtilisateurDTO[]> {
    if (this.useTestData) {
      const users = this.mockUtilisateurs.filter(u => u.actif === true);
      return of([...users]);
    }
    
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/status/active`)
      .pipe(
        catchError(error => {
          console.error('Error loading active users:', error);
          const users = this.mockUtilisateurs.filter(u => u.actif === true);
          return of([...users]);
        })
      );
  }

  /**
   * Get inactive users
   */
  getInactiveUsers(): Observable<UtilisateurDTO[]> {
    if (this.useTestData) {
      const users = this.mockUtilisateurs.filter(u => u.actif === false);
      return of([...users]);
    }
    
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/status/inactive`)
      .pipe(
        catchError(error => {
          console.error('Error loading inactive users:', error);
          const users = this.mockUtilisateurs.filter(u => u.actif === false);
          return of([...users]);
        })
      );
  }

  /**
   * Get current users state
   */
  getCurrentUtilisateurs(): UtilisateurDTO[] {
    return this.utilisateursSubject.value;
  }

  /**
   * Reset password
   */
  resetPassword(userId: number, newPassword: string): Observable<UtilisateurDTO> {
    if (this.useTestData) {
      const user = this.mockUtilisateurs.find(u => u.id === userId);
      if (user) {
        return of({ ...user });
      }
      return of({} as UtilisateurDTO);
    }
    
    return this.http.post<UtilisateurDTO>(`${this.apiUrl}/${userId}/reset-password`, { password: newPassword })
      .pipe(
        catchError(error => {
          console.error('Error resetting password:', error);
          const user = this.mockUtilisateurs.find(u => u.id === userId);
          return of(user || {} as UtilisateurDTO);
        })
      );
  }

  /**
   * Enable/disable test data mode
   */
  setTestDataMode(enabled: boolean): void {
    this.useTestData = enabled;
    if (enabled) {
      this.utilisateursSubject.next([...this.mockUtilisateurs]);
      this.rolesSubject.next([...this.mockRoles]);
    }
  }

  /**
   * Check if using test data
   */
  isUsingTestData(): boolean {
    return this.useTestData;
  }
}