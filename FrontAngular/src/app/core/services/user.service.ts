import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  private _utilisateurs = signal<UtilisateurDTO[]>([]);
  readonly utilisateurs = this._utilisateurs.asReadonly();

  private _roles = signal<Role[]>([]);
  readonly roles = this._roles.asReadonly();

  // Backend has no roles endpoint — keep these as the canonical roles known by the backend.
  private staticRoles: Role[] = [
    { id: 1, nom: 'SIMPLE_UTILISATEUR' },
    { id: 2, nom: 'RESPONSABLE' },
    { id: 3, nom: 'ADMINISTRATEUR' }
  ];

  constructor(private http: HttpClient) {
    this._roles.set([...this.staticRoles]);
  }

  // ==================== ROLES ====================

  getRoles(): Observable<Role[]> {
    this._roles.set([...this.staticRoles]);
    return of([...this.staticRoles]);
  }

  loadRoles(): void {
    this.getRoles().subscribe();
  }

  getCurrentRoles(): Role[] {
    return this._roles();
  }

  // ==================== UTILISATEURS ====================

  /** GET /api/utilisateurs */
  getUtilisateurs(): Observable<UtilisateurDTO[]> {
    return this.http.get<UtilisateurDTO[]>(this.apiUrl).pipe(
      tap(data => this._utilisateurs.set(data)),
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
        this._utilisateurs.update(current => current.filter(u => u.id !== userId));
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
    return this._utilisateurs();
  }

  private replaceInState(updated: UtilisateurDTO): void {
    this._utilisateurs.update(current => {
      const index = current.findIndex(u => u.id === updated.id);
      if (index === -1) return current;
      const next = [...current];
      next[index] = updated;
      return next;
    });
  }
}
