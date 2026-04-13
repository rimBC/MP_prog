import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  
  private apiUrl = 'http://localhost:8080/api/reference';
  
  // Domaines
  private domainesSubject = new BehaviorSubject<Domaine[]>([]);
  public domaines$ = this.domainesSubject.asObservable();
  
  // Structures
  private structuresSubject = new BehaviorSubject<Structure[]>([]);
  public structures$ = this.structuresSubject.asObservable();
  
  // Profils
  private profilsSubject = new BehaviorSubject<Profil[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAllData();
  }

  /**
   * Load all reference data
   */
  private loadAllData(): void {
    this.loadDomaines();
    this.loadStructures();
    this.loadProfils();
  }

  // ==================== DOMAINE METHODS ====================

  /**
   * Get all domaines
   */
  getDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(`${this.apiUrl}/domaines`)
      .pipe(
        tap(data => this.domainesSubject.next(data))
      );
  }

  /**
   * Load domaines into state
   */
  loadDomaines(): void {
    this.getDomaines().subscribe();
  }

  /**
   * Get domaine by ID
   */
  getDomaineById(id: number): Observable<Domaine> {
    return this.http.get<Domaine>(`${this.apiUrl}/domaines/${id}`);
  }

  /**
   * Create domaine
   */
  createDomaine(domaine: Domaine): Observable<Domaine> {
    return this.http.post<Domaine>(`${this.apiUrl}/domaines`, domaine)
      .pipe(
        tap(newDomaine => {
          const current = this.domainesSubject.value;
          this.domainesSubject.next([...current, newDomaine]);
        })
      );
  }

  /**
   * Update domaine
   */
  updateDomaine(id: number, domaine: Domaine): Observable<Domaine> {
    return this.http.put<Domaine>(`${this.apiUrl}/domaines/${id}`, domaine)
      .pipe(
        tap(updated => {
          const current = this.domainesSubject.value;
          const index = current.findIndex(d => d.id === id);
          if (index !== -1) {
            current[index] = updated;
            this.domainesSubject.next([...current]);
          }
        })
      );
  }

  /**
   * Delete domaine
   */
  deleteDomaine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/domaines/${id}`)
      .pipe(
        tap(() => {
          const current = this.domainesSubject.value;
          this.domainesSubject.next(current.filter(d => d.id !== id));
        })
      );
  }

  // ==================== STRUCTURE METHODS ====================

  /**
   * Get all structures
   */
  getStructures(): Observable<Structure[]> {
    return this.http.get<Structure[]>(`${this.apiUrl}/structures`)
      .pipe(
        tap(data => this.structuresSubject.next(data))
      );
  }

  /**
   * Load structures into state
   */
  loadStructures(): void {
    this.getStructures().subscribe();
  }

  /**
   * Get structure by ID
   */
  getStructureById(id: number): Observable<Structure> {
    return this.http.get<Structure>(`${this.apiUrl}/structures/${id}`);
  }

  /**
   * Create structure
   */
  createStructure(structure: Structure): Observable<Structure> {
    return this.http.post<Structure>(`${this.apiUrl}/structures`, structure)
      .pipe(
        tap(newStructure => {
          const current = this.structuresSubject.value;
          this.structuresSubject.next([...current, newStructure]);
        })
      );
  }

  /**
   * Update structure
   */
  updateStructure(id: number, structure: Structure): Observable<Structure> {
    return this.http.put<Structure>(`${this.apiUrl}/structures/${id}`, structure)
      .pipe(
        tap(updated => {
          const current = this.structuresSubject.value;
          const index = current.findIndex(s => s.id === id);
          if (index !== -1) {
            current[index] = updated;
            this.structuresSubject.next([...current]);
          }
        })
      );
  }

  /**
   * Delete structure
   */
  deleteStructure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/structures/${id}`)
      .pipe(
        tap(() => {
          const current = this.structuresSubject.value;
          this.structuresSubject.next(current.filter(s => s.id !== id));
        })
      );
  }

  // ==================== PROFIL METHODS ====================

  /**
   * Get all profils
   */
  getProfils(): Observable<Profil[]> {
    return this.http.get<Profil[]>(`${this.apiUrl}/profils`)
      .pipe(
        tap(data => this.profilsSubject.next(data))
      );
  }

  /**
   * Load profils into state
   */
  loadProfils(): void {
    this.getProfils().subscribe();
  }

  /**
   * Get profil by ID
   */
  getProfilById(id: number): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/profils/${id}`);
  }

  /**
   * Create profil
   */
  createProfil(profil: Profil): Observable<Profil> {
    return this.http.post<Profil>(`${this.apiUrl}/profils`, profil)
      .pipe(
        tap(newProfil => {
          const current = this.profilsSubject.value;
          this.profilsSubject.next([...current, newProfil]);
        })
      );
  }

  /**
   * Update profil
   */
  updateProfil(id: number, profil: Profil): Observable<Profil> {
    return this.http.put<Profil>(`${this.apiUrl}/profils/${id}`, profil)
      .pipe(
        tap(updated => {
          const current = this.profilsSubject.value;
          const index = current.findIndex(p => p.id === id);
          if (index !== -1) {
            current[index] = updated;
            this.profilsSubject.next([...current]);
          }
        })
      );
  }

  /**
   * Delete profil
   */
  deleteProfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profils/${id}`)
      .pipe(
        tap(() => {
          const current = this.profilsSubject.value;
          this.profilsSubject.next(current.filter(p => p.id !== id));
        })
      );
  }

  /**
   * Get current domaines state
   */
  getCurrentDomaines(): Domaine[] {
    return this.domainesSubject.value;
  }

  /**
   * Get current structures state
   */
  getCurrentStructures(): Structure[] {
    return this.structuresSubject.value;
  }

  /**
   * Get current profils state
   */
  getCurrentProfils(): Profil[] {
    return this.profilsSubject.value;
  }
}