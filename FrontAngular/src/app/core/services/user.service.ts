import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UtilisateurDTO } from '../../models/user.interface';

export interface Role {
  id: number;
  nom: string;
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

  // Backend has no roles endpoint — keep these as the canonical roles known by the backend.
  private staticRoles: Role[] = [
    { id: 1, nom: 'SIMPLE_UTILISATEUR' },
    { id: 2, nom: 'RESPONSABLE' },
    { id: 3, nom: 'ADMINISTRATEUR' }
  ];

  constructor(private http: HttpClient) {
    this.rolesSubject.next([...this.staticRoles]);
  }

  // ==================== ROLES ====================

  getRoles(): Observable<Role[]> {
    this.rolesSubject.next([...this.staticRoles]);
    return of([...this.staticRoles]);
  }

  loadRoles(): void {
    this.getRoles().subscribe();
  }

  getCurrentRoles(): Role[] {
    return this.rolesSubject.value;
  }

  // ==================== UTILISATEURS ====================

  /** GET /api/utilisateurs */
  getUtilisateurs(): Observable<UtilisateurDTO[]> {
    return this.http.get<UtilisateurDTO[]>(this.apiUrl).pipe(
      tap(data => this.utilisateursSubject.next(data)),
      catchError(error => {
        console.error('Error loading users:', error);
        return of([]);
      })
    );
  }

  loadUtilisateurs(): void {
    this.getUtilisateurs().subscribe();
  }

  /** GET /api/utilisateurs/{id} */
  getUtilisateurById(id: number): Observable<UtilisateurDTO> {
    return this.http.get<UtilisateurDTO>(`${this.apiUrl}/${id}`);
  }

  /** GET /api/utilisateurs/login/{login} */
  getUtilisateurByLogin(login: string): Observable<UtilisateurDTO> {
    return this.http.get<UtilisateurDTO>(`${this.apiUrl}/login/${login}`);
  }

  /** GET /api/utilisateurs/check-login/{login} */
  loginExists(login: string): Observable<{ [key: string]: boolean }> {
    return this.http.get<{ [key: string]: boolean }>(`${this.apiUrl}/check-login/${login}`);
  }

  /** GET /api/utilisateurs/role/{roleName} */
  getUsersByRole(roleName: string): Observable<UtilisateurDTO[]> {
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/role/${roleName}`);
  }

  /** GET /api/utilisateurs/status/active */
  getActiveUsers(): Observable<UtilisateurDTO[]> {
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/status/active`);
  }

  /** GET /api/utilisateurs/status/inactive */
  getInactiveUsers(): Observable<UtilisateurDTO[]> {
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/status/inactive`);
  }

  /** PUT /api/utilisateurs/{userId}/role/{roleId} */
  changeUserRole(userId: number, roleId: number): Observable<UtilisateurDTO> {
    return this.http.put<UtilisateurDTO>(`${this.apiUrl}/${userId}/role/${roleId}`, {}).pipe(
      tap(updated => this.replaceInState(updated))
    );
  }

  /** POST /api/utilisateurs/{id}/activate */
  activateUser(userId: number): Observable<UtilisateurDTO> {
    return this.http.post<UtilisateurDTO>(`${this.apiUrl}/${userId}/activate`, {}).pipe(
      tap(updated => this.replaceInState(updated))
    );
  }

  /** POST /api/utilisateurs/{id}/deactivate */
  deactivateUser(userId: number): Observable<UtilisateurDTO> {
    return this.http.post<UtilisateurDTO>(`${this.apiUrl}/${userId}/deactivate`, {}).pipe(
      tap(updated => this.replaceInState(updated))
    );
  }

  /** DELETE /api/utilisateurs/{id} */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        const current = this.utilisateursSubject.value;
        this.utilisateursSubject.next(current.filter(u => u.id !== userId));
      })
    );
  }

  /** POST /api/utilisateurs/{id}/reset-password — body is a Map<String, String> */
  resetPassword(userId: number, newPassword: string): Observable<UtilisateurDTO> {
    return this.http.post<UtilisateurDTO>(
      `${this.apiUrl}/${userId}/reset-password`,
      { password: newPassword }
    );
  }

  getCurrentUtilisateurs(): UtilisateurDTO[] {
    return this.utilisateursSubject.value;
  }

  private replaceInState(updated: UtilisateurDTO): void {
    const current = this.utilisateursSubject.value;
    const index = current.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      const next = [...current];
      next[index] = updated;
      this.utilisateursSubject.next(next);
    }
  }
}
