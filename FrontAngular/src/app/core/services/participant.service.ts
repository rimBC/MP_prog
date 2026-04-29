import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  private _participants = signal<ParticipantDTO[]>([]);
  readonly participants = this._participants.asReadonly();

  private _structures = signal<StructureDTO[]>([]);
  readonly structures = this._structures.asReadonly();

  private _profils = signal<ProfilDTO[]>([]);
  readonly profils = this._profils.asReadonly();

  constructor(private http: HttpClient) { }

  // ==================== PARTICIPANTS ====================

  /** GET /api/participants */
  getParticipants(): Observable<ParticipantDTO[]> {
    return this.http.get<ParticipantDTO[]>(this.apiUrl).pipe(
      tap(data => this._participants.set(data)),
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
        this._participants.update(current => [...current, created]);
      })
    );
  }

  /** PUT /api/participants/{id} */
  updateParticipant(id: number, participant: ParticipantDTO): Observable<ParticipantDTO> {
    return this.http.put<ParticipantDTO>(`${this.apiUrl}/${id}`, participant).pipe(
      tap(updated => {
        this._participants.update(current => {
          const idx = current.findIndex(p => p.id === id);
          if (idx === -1) return current;
          const next = [...current];
          next[idx] = updated;
          return next;
        });
      })
    );
  }

  /** DELETE /api/participants/{id} */
  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._participants.update(current => current.filter(p => p.id !== id));
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
    return this._participants();
  }

  // ==================== STRUCTURES ====================

  /** GET /api/reference/structures */
  getStructures(): Observable<StructureDTO[]> {
    return this.http.get<StructureDTO[]>(this.structuresUrl).pipe(
      tap(data => this._structures.set(data)),
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
    return this._structures();
  }

  // ==================== PROFILS ====================

  /** GET /api/reference/profils */
  getProfils(): Observable<ProfilDTO[]> {
    return this.http.get<ProfilDTO[]>(this.profilsUrl).pipe(
      tap(data => this._profils.set(data)),
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
    return this._profils();
  }

  private replaceInState(updated: ParticipantDTO): void {
    this._participants.update(current => {
      const idx = current.findIndex(p => p.id === updated.id);
      if (idx === -1) return current;
      const next = [...current];
      next[idx] = updated;
      return next;
    });
  }
}
