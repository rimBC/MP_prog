import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Structure {
  id: number;
  libelle: string;
  lieu?: string;
}

export interface Profil {
  id: number;
  libelle: string;
}

export interface ParticipantDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  dateEmbauche: string;
  actif: boolean;
  structureId: number;
  structureName?: string;
  profilId: number;
  profilName?: string;
  formationsCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  
  private apiUrl = 'http://localhost:8080/api/participants';
  
  private participantsSubject = new BehaviorSubject<ParticipantDTO[]>([]);
  public participants$ = this.participantsSubject.asObservable();
  
  private structuresSubject = new BehaviorSubject<Structure[]>([]);
  public structures$ = this.structuresSubject.asObservable();
  
  private profilsSubject = new BehaviorSubject<Profil[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  // ==================== TEST DATA ====================
  private mockStructures: Structure[] = [
    { id: 1, libelle: 'IT Department', lieu: 'Tunis' },
    { id: 2, libelle: 'HR Department', lieu: 'Sousse' },
    { id: 3, libelle: 'Finance Department', lieu: 'Sfax' },
    { id: 4, libelle: 'Marketing Department', lieu: 'Tunis' },
    { id: 5, libelle: 'Operations Department', lieu: 'Sousse' }
  ];

  private mockProfils: Profil[] = [
    { id: 1, libelle: 'Software Developer' },
    { id: 2, libelle: 'Business Analyst' },
    { id: 3, libelle: 'Project Manager' },
    { id: 4, libelle: 'HR Manager' },
    { id: 5, libelle: 'Financial Analyst' },
    { id: 6, libelle: 'Quality Assurance' }
  ];

  private mockParticipants: ParticipantDTO[] = [
    {
      id: 1,
      nom: 'Ahmed',
      prenom: 'Khalil',
      email: 'khalil.ahmed@company.com',
      tel: '216 91 234 567',
      dateEmbauche: '2020-03-15',
      actif: true,
      structureId: 1,
      structureName: 'IT Department',
      profilId: 1,
      profilName: 'Software Developer',
      formationsCount: 5
    },
    {
      id: 2,
      nom: 'Fatima',
      prenom: 'Ben',
      email: 'ben.fatima@company.com',
      tel: '216 92 345 678',
      dateEmbauche: '2019-07-20',
      actif: true,
      structureId: 2,
      structureName: 'HR Department',
      profilId: 4,
      profilName: 'HR Manager',
      formationsCount: 8
    },
    {
      id: 3,
      nom: 'Karim',
      prenom: 'Mohamed',
      email: 'mohamed.karim@company.com',
      tel: '216 93 456 789',
      dateEmbauche: '2021-01-10',
      actif: true,
      structureId: 1,
      structureName: 'IT Department',
      profilId: 2,
      profilName: 'Business Analyst',
      formationsCount: 4
    },
    {
      id: 4,
      nom: 'Noureddine',
      prenom: 'Ali',
      email: 'ali.noureddine@company.com',
      tel: '216 94 567 890',
      dateEmbauche: '2018-05-15',
      actif: true,
      structureId: 3,
      structureName: 'Finance Department',
      profilId: 5,
      profilName: 'Financial Analyst',
      formationsCount: 6
    },
    {
      id: 5,
      nom: 'Leila',
      prenom: 'Salma',
      email: 'salma.leila@company.com',
      tel: '216 95 678 901',
      dateEmbauche: '2019-09-01',
      actif: true,
      structureId: 4,
      structureName: 'Marketing Department',
      profilId: 3,
      profilName: 'Project Manager',
      formationsCount: 7
    },
    {
      id: 6,
      nom: 'Hassan',
      prenom: 'Omar',
      email: 'omar.hassan@company.com',
      tel: '216 96 789 012',
      dateEmbauche: '2020-11-20',
      actif: true,
      structureId: 1,
      structureName: 'IT Department',
      profilId: 6,
      profilName: 'Quality Assurance',
      formationsCount: 3
    },
    {
      id: 7,
      nom: 'Amira',
      prenom: 'Layla',
      email: 'layla.amira@company.com',
      tel: '216 97 890 123',
      dateEmbauche: '2021-02-28',
      actif: true,
      structureId: 5,
      structureName: 'Operations Department',
      profilId: 1,
      profilName: 'Software Developer',
      formationsCount: 2
    },
    {
      id: 8,
      nom: 'Tarek',
      prenom: 'Rashid',
      email: 'rashid.tarek@company.com',
      tel: '216 98 901 234',
      dateEmbauche: '2017-08-10',
      actif: false,
      structureId: 2,
      structureName: 'HR Department',
      profilId: 4,
      profilName: 'HR Manager',
      formationsCount: 9
    },
    {
      id: 9,
      nom: 'Nadia',
      prenom: 'Hana',
      email: 'hana.nadia@company.com',
      tel: '216 99 012 345',
      dateEmbauche: '2020-06-15',
      actif: true,
      structureId: 3,
      structureName: 'Finance Department',
      profilId: 5,
      profilName: 'Financial Analyst',
      formationsCount: 5
    },
    {
      id: 10,
      nom: 'Samir',
      prenom: 'Walid',
      email: 'walid.samir@company.com',
      tel: '216 90 123 456',
      dateEmbauche: '2019-04-20',
      actif: true,
      structureId: 1,
      structureName: 'IT Department',
      profilId: 1,
      profilName: 'Software Developer',
      formationsCount: 6
    }
  ];

  private useTestData = true;

  constructor(private http: HttpClient) {
    this.loadParticipants();
    this.loadStructures();
    this.loadProfils();
  }

  // ==================== PARTICIPANTS ====================

  /**
   * Get all participants
   */
  getParticipants(): Observable<ParticipantDTO[]> {
    if (this.useTestData) {
      this.participantsSubject.next([...this.mockParticipants]);
      return of([...this.mockParticipants]);
    }

    return this.http.get<ParticipantDTO[]>(this.apiUrl)
      .pipe(
        tap(data => this.participantsSubject.next(data)),
        catchError(error => {
          console.error('Error loading participants:', error);
          this.participantsSubject.next([...this.mockParticipants]);
          return of([...this.mockParticipants]);
        })
      );
  }

  /**
   * Load participants into state
   */
  loadParticipants(): void {
    this.getParticipants().subscribe();
  }

  /**
   * Get participant by ID
   */
  getParticipantById(id: number): Observable<ParticipantDTO> {
    if (this.useTestData) {
      const participant = this.mockParticipants.find(p => p.id === id);
      return of(participant || {} as ParticipantDTO);
    }

    return this.http.get<ParticipantDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error loading participant:', error);
          const participant = this.mockParticipants.find(p => p.id === id);
          return of(participant || {} as ParticipantDTO);
        })
      );
  }

  /**
   * Create participant
   */
  createParticipant(participant: ParticipantDTO): Observable<ParticipantDTO> {
    if (this.useTestData) {
      const newId = Math.max(...this.mockParticipants.map(p => p.id), 0) + 1;
      const newParticipant = { ...participant, id: newId, formationsCount: 0 };
      this.mockParticipants.push(newParticipant);
      
      const current = this.participantsSubject.value;
      this.participantsSubject.next([...current, newParticipant]);
      
      return of(newParticipant);
    }

    return this.http.post<ParticipantDTO>(this.apiUrl, participant)
      .pipe(
        tap(newParticipant => {
          const current = this.participantsSubject.value;
          this.participantsSubject.next([...current, newParticipant]);
        }),
        catchError(error => {
          console.error('Error creating participant:', error);
          const newId = Math.max(...this.mockParticipants.map(p => p.id), 0) + 1;
          const newParticipant = { ...participant, id: newId, formationsCount: 0 };
          this.mockParticipants.push(newParticipant);
          return of(newParticipant);
        })
      );
  }

  /**
   * Update participant
   */
  updateParticipant(id: number, participant: ParticipantDTO): Observable<ParticipantDTO> {
    if (this.useTestData) {
      const index = this.mockParticipants.findIndex(p => p.id === id);
      if (index !== -1) {
        this.mockParticipants[index] = { ...participant, id };
        
        const current = this.participantsSubject.value;
        const currIndex = current.findIndex(p => p.id === id);
        if (currIndex !== -1) {
          current[currIndex] = { ...participant, id };
          this.participantsSubject.next([...current]);
        }
      }
      return of({ ...participant, id });
    }

    return this.http.put<ParticipantDTO>(`${this.apiUrl}/${id}`, participant)
      .pipe(
        tap(updated => {
          const current = this.participantsSubject.value;
          const index = current.findIndex(p => p.id === id);
          if (index !== -1) {
            current[index] = updated;
            this.participantsSubject.next([...current]);
          }
        }),
        catchError(error => {
          console.error('Error updating participant:', error);
          const index = this.mockParticipants.findIndex(p => p.id === id);
          if (index !== -1) {
            this.mockParticipants[index] = { ...participant, id };
          }
          return of({ ...participant, id });
        })
      );
  }

  /**
   * Delete participant
   */
  deleteParticipant(id: number): Observable<void> {
    if (this.useTestData) {
      this.mockParticipants = this.mockParticipants.filter(p => p.id !== id);
      
      const current = this.participantsSubject.value;
      this.participantsSubject.next(current.filter(p => p.id !== id));
      
      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const current = this.participantsSubject.value;
          this.participantsSubject.next(current.filter(p => p.id !== id));
        }),
        catchError(error => {
          console.error('Error deleting participant:', error);
          this.mockParticipants = this.mockParticipants.filter(p => p.id !== id);
          return of(void 0);
        })
      );
  }

  /**
   * Get participants by structure
   */
  getParticipantsByStructure(structureId: number): Observable<ParticipantDTO[]> {
    if (this.useTestData) {
      const participants = this.mockParticipants.filter(p => p.structureId === structureId);
      return of([...participants]);
    }

    return this.http.get<ParticipantDTO[]>(`${this.apiUrl}/structure/${structureId}`)
      .pipe(
        catchError(error => {
          console.error('Error loading participants by structure:', error);
          const participants = this.mockParticipants.filter(p => p.structureId === structureId);
          return of([...participants]);
        })
      );
  }

  /**
   * Get active participants
   */
  getActiveParticipants(): Observable<ParticipantDTO[]> {
    if (this.useTestData) {
      const participants = this.mockParticipants.filter(p => p.actif);
      return of([...participants]);
    }

    return this.http.get<ParticipantDTO[]>(`${this.apiUrl}/status/active`)
      .pipe(
        catchError(error => {
          console.error('Error loading active participants:', error);
          const participants = this.mockParticipants.filter(p => p.actif);
          return of([...participants]);
        })
      );
  }

  /**
   * Get current participants state
   */
  getCurrentParticipants(): ParticipantDTO[] {
    return this.participantsSubject.value;
  }

  // ==================== STRUCTURES ====================

  /**
   * Get all structures
   */
  getStructures(): Observable<Structure[]> {
    if (this.useTestData) {
      this.structuresSubject.next([...this.mockStructures]);
      return of([...this.mockStructures]);
    }

    return this.http.get<Structure[]>('http://localhost:8080/api/reference/structures')
      .pipe(
        tap(data => this.structuresSubject.next(data)),
        catchError(error => {
          console.error('Error loading structures:', error);
          this.structuresSubject.next([...this.mockStructures]);
          return of([...this.mockStructures]);
        })
      );
  }

  /**
   * Load structures into state
   */
  loadStructures(): void {
    this.getStructures().subscribe();
  }

  /**
   * Get current structures state
   */
  getCurrentStructures(): Structure[] {
    return this.structuresSubject.value;
  }

  // ==================== PROFILS ====================

  /**
   * Get all profils
   */
  getProfils(): Observable<Profil[]> {
    if (this.useTestData) {
      this.profilsSubject.next([...this.mockProfils]);
      return of([...this.mockProfils]);
    }

    return this.http.get<Profil[]>('http://localhost:8080/api/reference/profils')
      .pipe(
        tap(data => this.profilsSubject.next(data)),
        catchError(error => {
          console.error('Error loading profils:', error);
          this.profilsSubject.next([...this.mockProfils]);
          return of([...this.mockProfils]);
        })
      );
  }

  /**
   * Load profils into state
   */
  loadProfils(): void {
    this.getProfils().subscribe();
  }

  /**
   * Get current profils state
   */
  getCurrentProfils(): Profil[] {
    return this.profilsSubject.value;
  }

  /**
   * Enable/disable test data mode
   */
  setTestDataMode(enabled: boolean): void {
    this.useTestData = enabled;
    if (enabled) {
      this.participantsSubject.next([...this.mockParticipants]);
      this.structuresSubject.next([...this.mockStructures]);
      this.profilsSubject.next([...this.mockProfils]);
    }
  }

  /**
   * Check if using test data
   */
  isUsingTestData(): boolean {
    return this.useTestData;
  }
}