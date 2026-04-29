import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormateurDTO } from '../../models/formateur.interface';
import { EmployeurDTO } from '../../models/employeur.interface';

export type { FormateurDTO, EmployeurDTO };
export type Employeur = EmployeurDTO;

@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  private apiUrl = 'http://localhost:8080/api/formateurs';
  private employeursUrl = 'http://localhost:8080/api/reference/employeurs';

  private _formateurs = signal<FormateurDTO[]>([]);
  readonly formateurs = this._formateurs.asReadonly();

  private _employeurs = signal<EmployeurDTO[]>([]);
  readonly employeurs = this._employeurs.asReadonly();

  constructor(private http: HttpClient) { }

  // ==================== FORMATEURS ====================

  /** GET /api/formateurs */
  getFormateurs(): Observable<FormateurDTO[]> {
    return this.http.get<FormateurDTO[]>(this.apiUrl).pipe(
      tap(data => this._formateurs.set(data)),
      catchError(error => {
        console.error('Error loading formateurs:', error);
        return of([]);
      })
    );
  }

  loadFormateurs(): void {
    this.getFormateurs().subscribe();
  }

  /** GET /api/formateurs/{id} */
  getFormateurById(id: number): Observable<FormateurDTO> {
    return this.http.get<FormateurDTO>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/formateurs */
  createFormateur(formateur: FormateurDTO): Observable<FormateurDTO> {
    return this.http.post<FormateurDTO>(this.apiUrl, formateur).pipe(
      tap(created => {
        this._formateurs.update(current => [...current, created]);
      })
    );
  }

  /** PUT /api/formateurs/{id} */
  updateFormateur(id: number, formateur: FormateurDTO): Observable<FormateurDTO> {
    return this.http.put<FormateurDTO>(`${this.apiUrl}/${id}`, formateur).pipe(
      tap(updated => {
        this._formateurs.update(current => {
          const idx = current.findIndex(f => f.id === id);
          if (idx === -1) return current;
          const next = [...current];
          next[idx] = updated;
          return next;
        });
      })
    );
  }

  /** DELETE /api/formateurs/{id} */
  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._formateurs.update(current => current.filter(f => f.id !== id));
      })
    );
  }

  /** GET /api/formateurs/type/{type} — type is "interne" or "externe" */
  getFormateursByType(type: string): Observable<FormateurDTO[]> {
    return this.http.get<FormateurDTO[]>(`${this.apiUrl}/type/${type}`);
  }

  getInternalFormateurs(): Observable<FormateurDTO[]> {
    return this.getFormateursByType('interne');
  }

  getExternalFormateurs(): Observable<FormateurDTO[]> {
    return this.getFormateursByType('externe');
  }

  getCurrentFormateurs(): FormateurDTO[] {
    return this._formateurs();
  }

  // ==================== EMPLOYEURS ====================
  // Backend exposes employeurs under /api/reference/employeurs.

  /** GET /api/reference/employeurs */
  getEmployeurs(): Observable<EmployeurDTO[]> {
    return this.http.get<EmployeurDTO[]>(this.employeursUrl).pipe(
      tap(data => this._employeurs.set(data)),
      catchError(error => {
        console.error('Error loading employeurs:', error);
        return of([]);
      })
    );
  }

  loadEmployeurs(): void {
    this.getEmployeurs().subscribe();
  }

  getCurrentEmployeurs(): EmployeurDTO[] {
    return this._employeurs();
  }
}
