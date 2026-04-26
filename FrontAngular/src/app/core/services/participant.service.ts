import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ParticipantDTO } from '../../models/participant.interface';
import { StructureDTO } from '../../models/structure.interface';
import { ProfilDTO } from '../../models/profile.interface';

export type { ParticipantDTO, StructureDTO, ProfilDTO };
export type Structure = StructureDTO;
export type Profil = ProfilDTO;

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private apiUrl = 'http://localhost:8080/api/participants';
  private structuresUrl = 'http://localhost:8080/api/reference/structures';
  private profilsUrl = 'http://localhost:8080/api/reference/profils';

  private participantsSubject = new BehaviorSubject<ParticipantDTO[]>([]);
  public participants$ = this.participantsSubject.asObservable();

  private structuresSubject = new BehaviorSubject<StructureDTO[]>([]);
  public structures$ = this.structuresSubject.asObservable();

  private profilsSubject = new BehaviorSubject<ProfilDTO[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ==================== PARTICIPANTS ====================

  /** GET /api/participants */
  getParticipants(): Observable<ParticipantDTO[]> {
    return this.http.get<ParticipantDTO[]>(this.apiUrl).pipe(
      tap(data => this.participantsSubject.next(data)),
      catchError(error => {
        console.error('Error loading participants:', error);
        return of([]);
      })
    );
  }

  loadParticipants(): void {
    this.getParticipants().subscribe();
  }

  /** GET /api/participants/{id} */
  getParticipantById(id: number): Observable<ParticipantDTO> {
    return this.http.get<ParticipantDTO>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/participants */
  createParticipant(participant: ParticipantDTO): Observable<ParticipantDTO> {
    return this.http.post<ParticipantDTO>(this.apiUrl, participant).pipe(
      tap(created => {
        this.participantsSubject.next([...this.participantsSubject.value, created]);
      })
    );
  }

  /** PUT /api/participants/{id} */
  updateParticipant(id: number, participant: ParticipantDTO): Observable<ParticipantDTO> {
    return this.http.put<ParticipantDTO>(`${this.apiUrl}/${id}`, participant).pipe(
      tap(updated => {
        const current = this.participantsSubject.value;
        const idx = current.findIndex(p => p.id === id);
        if (idx !== -1) {
          const next = [...current];
          next[idx] = updated;
          this.participantsSubject.next(next);
        }
      })
    );
  }

  /** DELETE /api/participants/{id} */
  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.participantsSubject.next(
          this.participantsSubject.value.filter(p => p.id !== id)
        );
      })
    );
  }

  /** POST /api/participants/{id}/deactivate */
  deactivateParticipant(id: number): Observable<ParticipantDTO> {
    return this.http.post<ParticipantDTO>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      tap(updated => this.replaceInState(updated))
    );
  }

  /** POST /api/participants/{id}/reactivate */
  reactivateParticipant(id: number): Observable<ParticipantDTO> {
    return this.http.post<ParticipantDTO>(`${this.apiUrl}/${id}/reactivate`, {}).pipe(
      tap(updated => this.replaceInState(updated))
    );
  }

  /** GET /api/participants/structure/{structureId} */
  getParticipantsByStructure(structureId: number): Observable<ParticipantDTO[]> {
    return this.http.get<ParticipantDTO[]>(`${this.apiUrl}/structure/${structureId}`);
  }

  /** GET /api/participants/profil/{profilId} */
  getParticipantsByProfil(profilId: number): Observable<ParticipantDTO[]> {
    return this.http.get<ParticipantDTO[]>(`${this.apiUrl}/profil/${profilId}`);
  }

  /** GET /api/participants/formation/{formationId} */
  getParticipantsByFormation(formationId: number): Observable<ParticipantDTO[]> {
    return this.http.get<ParticipantDTO[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  /** GET /api/participants/count/structure/{structureId} */
  countParticipantsByStructure(structureId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/structure/${structureId}`);
  }

  /** GET /api/participants/active */
  getActiveParticipants(): Observable<ParticipantDTO[]> {
    return this.http.get<ParticipantDTO[]>(`${this.apiUrl}/active`);
  }

  getCurrentParticipants(): ParticipantDTO[] {
    return this.participantsSubject.value;
  }

  // ==================== STRUCTURES ====================

  /** GET /api/reference/structures */
  getStructures(): Observable<StructureDTO[]> {
    return this.http.get<StructureDTO[]>(this.structuresUrl).pipe(
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

  getCurrentStructures(): StructureDTO[] {
    return this.structuresSubject.value;
  }

  // ==================== PROFILS ====================

  /** GET /api/reference/profils */
  getProfils(): Observable<ProfilDTO[]> {
    return this.http.get<ProfilDTO[]>(this.profilsUrl).pipe(
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

  getCurrentProfils(): ProfilDTO[] {
    return this.profilsSubject.value;
  }

  private replaceInState(updated: ParticipantDTO): void {
    const current = this.participantsSubject.value;
    const idx = current.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      const next = [...current];
      next[idx] = updated;
      this.participantsSubject.next(next);
    }
  }
}
