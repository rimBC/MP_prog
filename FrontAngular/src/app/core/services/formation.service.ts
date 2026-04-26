import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormationDTO } from '../../models/formationDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private apiUrl = 'http://localhost:8080/api/formations';

  private formationsSubject = new BehaviorSubject<FormationDTO[]>([]);
  public formations$ = this.formationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  /** GET /api/formations */
  getFormations(): Observable<FormationDTO[]> {
    return this.http.get<FormationDTO[]>(this.apiUrl).pipe(
      tap(data => this.formationsSubject.next(data)),
      catchError(error => {
        console.error('Error loading formations:', error);
        return of([]);
      })
    );
  }

  loadFormations(): void {
    this.getFormations().subscribe();
  }

  /** GET /api/formations/{id} */
  getFormationById(id: number): Observable<FormationDTO> {
    return this.http.get<FormationDTO>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/formations */
  createFormation(formation: FormationDTO): Observable<FormationDTO> {
    return this.http.post<FormationDTO>(this.apiUrl, formation).pipe(
      tap(created => {
        this.formationsSubject.next([...this.formationsSubject.value, created]);
      })
    );
  }

  /** PUT /api/formations/{id} */
  updateFormation(id: number, formation: FormationDTO): Observable<FormationDTO> {
    return this.http.put<FormationDTO>(`${this.apiUrl}/${id}`, formation).pipe(
      tap(updated => {
        const current = this.formationsSubject.value;
        const idx = current.findIndex(f => f.id === id);
        if (idx !== -1) {
          const next = [...current];
          next[idx] = updated;
          this.formationsSubject.next(next);
        }
      })
    );
  }

  /** DELETE /api/formations/{id} */
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.formationsSubject.next(
          this.formationsSubject.value.filter(f => f.id !== id)
        );
      })
    );
  }

  /** GET /api/formations/year/{year} */
  getFormationsByYear(year: number): Observable<FormationDTO[]> {
    return this.http.get<FormationDTO[]>(`${this.apiUrl}/year/${year}`);
  }

  /** GET /api/formations/status/{status} */
  getFormationsByStatus(status: string): Observable<FormationDTO[]> {
    return this.http.get<FormationDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  /** GET /api/formations/formateur/{formateurId} */
  getFormationsByFormateur(formateurId: number): Observable<FormationDTO[]> {
    return this.http.get<FormationDTO[]>(`${this.apiUrl}/formateur/${formateurId}`);
  }

  /** GET /api/formations/domain/{domaineId} */
  getFormationsByDomain(domaineId: number): Observable<FormationDTO[]> {
    return this.http.get<FormationDTO[]>(`${this.apiUrl}/domain/${domaineId}`);
  }

  /** GET /api/formations/daterange?startDate&endDate (ISO date: YYYY-MM-DD) */
  getFormationsByDateRange(startDate: string, endDate: string): Observable<FormationDTO[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<FormationDTO[]>(`${this.apiUrl}/daterange`, { params });
  }

  /** GET /api/formations/count/domain/{domaineId} */
  getFormationCountByDomain(domaineId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/domain/${domaineId}`);
  }

  getCurrentFormations(): FormationDTO[] {
    return this.formationsSubject.value;
  }
}
