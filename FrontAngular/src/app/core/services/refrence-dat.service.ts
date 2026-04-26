import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DomaineDTO, Domaine } from '../../models/domaine.interface';
import { StructureDTO, Structure } from '../../models/structure.interface';
import { ProfilDTO, Profil } from '../../models/profile.interface';
import { EmployeurDTO, Employeur } from '../../models/employeur.interface';

export type { DomaineDTO, Domaine, StructureDTO, Structure, ProfilDTO, Profil, EmployeurDTO, Employeur };

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {

  private apiUrl = 'http://localhost:8080/api/reference';

  private domainesSubject = new BehaviorSubject<DomaineDTO[]>([]);
  public domaines$ = this.domainesSubject.asObservable();

  private structuresSubject = new BehaviorSubject<StructureDTO[]>([]);
  public structures$ = this.structuresSubject.asObservable();

  private profilsSubject = new BehaviorSubject<ProfilDTO[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  private employeursSubject = new BehaviorSubject<EmployeurDTO[]>([]);
  public employeurs$ = this.employeursSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ==================== DOMAINES ====================

  /** GET /api/reference/domaines */
  getDomaines(): Observable<DomaineDTO[]> {
    return this.http.get<DomaineDTO[]>(`${this.apiUrl}/domaines`).pipe(
      tap(data => this.domainesSubject.next(data)),
      catchError(error => {
        console.error('Error loading domaines:', error);
        return of([]);
      })
    );
  }

  loadDomaines(): void {
    this.getDomaines().subscribe();
  }

  /** GET /api/reference/domaines/{id} */
  getDomaineById(id: number): Observable<DomaineDTO> {
    return this.http.get<DomaineDTO>(`${this.apiUrl}/domaines/${id}`);
  }

  /** POST /api/reference/domaines */
  createDomaine(domaine: DomaineDTO): Observable<DomaineDTO> {
    return this.http.post<DomaineDTO>(`${this.apiUrl}/domaines`, domaine).pipe(
      tap(created => {
        this.domainesSubject.next([...this.domainesSubject.value, created]);
      })
    );
  }

  /** PUT /api/reference/domaines/{id} */
  updateDomaine(id: number, domaine: DomaineDTO): Observable<DomaineDTO> {
    return this.http.put<DomaineDTO>(`${this.apiUrl}/domaines/${id}`, domaine).pipe(
      tap(updated => {
        const current = this.domainesSubject.value;
        const idx = current.findIndex(d => d.id === id);
        if (idx !== -1) {
          const next = [...current];
          next[idx] = updated;
          this.domainesSubject.next(next);
        }
      })
    );
  }

  /** DELETE /api/reference/domaines/{id} */
  deleteDomaine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/domaines/${id}`).pipe(
      tap(() => {
        this.domainesSubject.next(
          this.domainesSubject.value.filter(d => d.id !== id)
        );
      })
    );
  }

  getCurrentDomaines(): DomaineDTO[] {
    return this.domainesSubject.value;
  }

  // ==================== STRUCTURES ====================

  /** GET /api/reference/structures */
  getStructures(): Observable<StructureDTO[]> {
    return this.http.get<StructureDTO[]>(`${this.apiUrl}/structures`).pipe(
      tap(data => this.structuresSubject.next(data)),
      catchError(error => {
        console.error('Error loading structures:', error);
        return of([]);
      })
    );
  }

  loadStructures(): void {
    this.getStructures().subscribe();
  }

  /** GET /api/reference/structures/{id} */
  getStructureById(id: number): Observable<StructureDTO> {
    return this.http.get<StructureDTO>(`${this.apiUrl}/structures/${id}`);
  }

  /** POST /api/reference/structures */
  createStructure(structure: StructureDTO): Observable<StructureDTO> {
    return this.http.post<StructureDTO>(`${this.apiUrl}/structures`, structure).pipe(
      tap(created => {
        this.structuresSubject.next([...this.structuresSubject.value, created]);
      })
    );
  }

  /** PUT /api/reference/structures/{id} */
  updateStructure(id: number, structure: StructureDTO): Observable<StructureDTO> {
    return this.http.put<StructureDTO>(`${this.apiUrl}/structures/${id}`, structure).pipe(
      tap(updated => {
        const current = this.structuresSubject.value;
        const idx = current.findIndex(s => s.id === id);
        if (idx !== -1) {
          const next = [...current];
          next[idx] = updated;
          this.structuresSubject.next(next);
        }
      })
    );
  }

  /** DELETE /api/reference/structures/{id} */
  deleteStructure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/structures/${id}`).pipe(
      tap(() => {
        this.structuresSubject.next(
          this.structuresSubject.value.filter(s => s.id !== id)
        );
      })
    );
  }

  getCurrentStructures(): StructureDTO[] {
    return this.structuresSubject.value;
  }

  // ==================== PROFILS ====================

  /** GET /api/reference/profils */
  getProfils(): Observable<ProfilDTO[]> {
    return this.http.get<ProfilDTO[]>(`${this.apiUrl}/profils`).pipe(
      tap(data => this.profilsSubject.next(data)),
      catchError(error => {
        console.error('Error loading profils:', error);
        return of([]);
      })
    );
  }

  loadProfils(): void {
    this.getProfils().subscribe();
  }

  /** GET /api/reference/profils/{id} */
  getProfilById(id: number): Observable<ProfilDTO> {
    return this.http.get<ProfilDTO>(`${this.apiUrl}/profils/${id}`);
  }

  /** POST /api/reference/profils */
  createProfil(profil: ProfilDTO): Observable<ProfilDTO> {
    return this.http.post<ProfilDTO>(`${this.apiUrl}/profils`, profil).pipe(
      tap(created => {
        this.profilsSubject.next([...this.profilsSubject.value, created]);
      })
    );
  }

  /** PUT /api/reference/profils/{id} */
  updateProfil(id: number, profil: ProfilDTO): Observable<ProfilDTO> {
    return this.http.put<ProfilDTO>(`${this.apiUrl}/profils/${id}`, profil).pipe(
      tap(updated => {
        const current = this.profilsSubject.value;
        const idx = current.findIndex(p => p.id === id);
        if (idx !== -1) {
          const next = [...current];
          next[idx] = updated;
          this.profilsSubject.next(next);
        }
      })
    );
  }

  /** DELETE /api/reference/profils/{id} */
  deleteProfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profils/${id}`).pipe(
      tap(() => {
        this.profilsSubject.next(
          this.profilsSubject.value.filter(p => p.id !== id)
        );
      })
    );
  }

  getCurrentProfils(): ProfilDTO[] {
    return this.profilsSubject.value;
  }

  // ==================== EMPLOYEURS ====================

  /** GET /api/reference/employeurs */
  getEmployeurs(): Observable<EmployeurDTO[]> {
    return this.http.get<EmployeurDTO[]>(`${this.apiUrl}/employeurs`).pipe(
      tap(data => this.employeursSubject.next(data)),
      catchError(error => {
        console.error('Error loading employeurs:', error);
        return of([]);
      })
    );
  }

  loadEmployeurs(): void {
    this.getEmployeurs().subscribe();
  }

  /** GET /api/reference/employeurs/{id} */
  getEmployeurById(id: number): Observable<EmployeurDTO> {
    return this.http.get<EmployeurDTO>(`${this.apiUrl}/employeurs/${id}`);
  }

  /** POST /api/reference/employeurs */
  createEmployeur(employeur: EmployeurDTO): Observable<EmployeurDTO> {
    return this.http.post<EmployeurDTO>(`${this.apiUrl}/employeurs`, employeur).pipe(
      tap(created => {
        this.employeursSubject.next([...this.employeursSubject.value, created]);
      })
    );
  }

  /** PUT /api/reference/employeurs/{id} */
  updateEmployeur(id: number, employeur: EmployeurDTO): Observable<EmployeurDTO> {
    return this.http.put<EmployeurDTO>(`${this.apiUrl}/employeurs/${id}`, employeur).pipe(
      tap(updated => {
        const current = this.employeursSubject.value;
        const idx = current.findIndex(e => e.id === id);
        if (idx !== -1) {
          const next = [...current];
          next[idx] = updated;
          this.employeursSubject.next(next);
        }
      })
    );
  }

  /** DELETE /api/reference/employeurs/{id} */
  deleteEmployeur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employeurs/${id}`).pipe(
      tap(() => {
        this.employeursSubject.next(
          this.employeursSubject.value.filter(e => e.id !== id)
        );
      })
    );
  }

  getCurrentEmployeurs(): EmployeurDTO[] {
    return this.employeursSubject.value;
  }

  // ==================== UTILITY ====================

  loadAllReferenceData(): void {
    this.loadDomaines();
    this.loadStructures();
    this.loadProfils();
    this.loadEmployeurs();
  }
}
