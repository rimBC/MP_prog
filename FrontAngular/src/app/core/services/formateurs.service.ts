import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Employeur {
  id: number;
  nomemployeur: string;
}

export interface FormateurDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  type: string; // 'interne' or 'externe'
  specialite: string;
  bio: string;
  employeurId?: number;
  employeurNom?: string;
  formationsCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  
  private apiUrl = 'http://localhost:8080/api/formateurs';
  
  private formateursSubject = new BehaviorSubject<FormateurDTO[]>([]);
  public formateurs$ = this.formateursSubject.asObservable();
  
  private employeursSubject = new BehaviorSubject<Employeur[]>([]);
  public employeurs$ = this.employeursSubject.asObservable();

  // ==================== TEST DATA ====================
  private mockEmployeurs: Employeur[] = [
    { id: 1, nomemployeur: 'TechCorp International' },
    { id: 2, nomemployeur: 'Global Training Solutions' },
    { id: 3, nomemployeur: 'Innovation Consultants Inc' },
    { id: 4, nomemployeur: 'Digital Academy' }
  ];

  private mockFormateurs: FormateurDTO[] = [
    {
      id: 1,
      nom: 'Johnson',
      prenom: 'Michael',
      email: 'michael.johnson@company.com',
      tel: '216 12 345 678',
      type: 'interne',
      specialite: 'Angular & TypeScript',
      bio: 'Senior Full Stack Developer with 12 years of experience in web technologies',
      employeurId: undefined,
      employeurNom: 'In-House',
      formationsCount: 8
    },
    {
      id: 2,
      nom: 'Smith',
      prenom: 'Sarah',
      email: 'sarah.smith@company.com',
      tel: '216 23 456 789',
      type: 'interne',
      specialite: 'Python & Data Science',
      bio: 'Data Science Expert specializing in machine learning and AI solutions',
      employeurId: undefined,
      employeurNom: 'In-House',
      formationsCount: 6
    },
    {
      id: 3,
      nom: 'Williams',
      prenom: 'David',
      email: 'david.williams@techcorp.com',
      tel: '216 34 567 890',
      type: 'externe',
      specialite: 'Cloud Architecture',
      bio: 'AWS certified architect with expertise in cloud solutions and DevOps',
      employeurId: 1,
      employeurNom: 'TechCorp International',
      formationsCount: 4
    },
    {
      id: 4,
      nom: 'Brown',
      prenom: 'Jennifer',
      email: 'jennifer.brown@company.com',
      tel: '216 45 678 901',
      type: 'interne',
      specialite: 'Project Management',
      bio: 'PMP certified project manager with 10 years in enterprise projects',
      employeurId: undefined,
      employeurNom: 'In-House',
      formationsCount: 7
    },
    {
      id: 5,
      nom: 'Davis',
      prenom: 'Robert',
      email: 'robert.davis@globalsolutions.com',
      tel: '216 56 789 012',
      type: 'externe',
      specialite: 'HR & Organizational Development',
      bio: 'HR specialist focused on organizational change and talent development',
      employeurId: 2,
      employeurNom: 'Global Training Solutions',
      formationsCount: 5
    },
    {
      id: 6,
      nom: 'Miller',
      prenom: 'Lisa',
      email: 'lisa.miller@company.com',
      tel: '216 67 890 123',
      type: 'interne',
      specialite: 'Communication & Soft Skills',
      bio: 'Communication coach specializing in leadership and interpersonal skills',
      employeurId: undefined,
      employeurNom: 'In-House',
      formationsCount: 9
    },
    {
      id: 7,
      nom: 'Martinez',
      prenom: 'Carlos',
      email: 'carlos.martinez@innovation.com',
      tel: '216 78 901 234',
      type: 'externe',
      specialite: 'Business Strategy',
      bio: 'Strategic consultant with focus on digital transformation',
      employeurId: 3,
      employeurNom: 'Innovation Consultants Inc',
      formationsCount: 3
    },
    {
      id: 8,
      nom: 'Anderson',
      prenom: 'Emily',
      email: 'emily.anderson@academy.com',
      tel: '216 89 012 345',
      type: 'externe',
      specialite: 'Technical Writing & Documentation',
      bio: 'Technical writer with 8 years of experience in software documentation',
      employeurId: 4,
      employeurNom: 'Digital Academy',
      formationsCount: 4
    }
  ];

  private useTestData = true;

  constructor(private http: HttpClient) {
    this.loadFormateurs();
    this.loadEmployeurs();
  }

  // ==================== FORMATEURS ====================

  /**
   * Get all formateurs
   */
  getFormateurs(): Observable<FormateurDTO[]> {
    if (this.useTestData) {
      this.formateursSubject.next([...this.mockFormateurs]);
      return of([...this.mockFormateurs]);
    }

    return this.http.get<FormateurDTO[]>(this.apiUrl)
      .pipe(
        tap(data => this.formateursSubject.next(data)),
        catchError(error => {
          console.error('Error loading formateurs:', error);
          this.formateursSubject.next([...this.mockFormateurs]);
          return of([...this.mockFormateurs]);
        })
      );
  }

  /**
   * Load formateurs into state
   */
  loadFormateurs(): void {
    this.getFormateurs().subscribe();
  }

  /**
   * Get formateur by ID
   */
  getFormateurById(id: number): Observable<FormateurDTO> {
    if (this.useTestData) {
      const formateur = this.mockFormateurs.find(f => f.id === id);
      return of(formateur || {} as FormateurDTO);
    }

    return this.http.get<FormateurDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formateur:', error);
          const formateur = this.mockFormateurs.find(f => f.id === id);
          return of(formateur || {} as FormateurDTO);
        })
      );
  }

  /**
   * Create formateur
   */
  createFormateur(formateur: FormateurDTO): Observable<FormateurDTO> {
    if (this.useTestData) {
      const newId = Math.max(...this.mockFormateurs.map(f => f.id), 0) + 1;
      const newFormateur = { ...formateur, id: newId, formationsCount: 0 };
      this.mockFormateurs.push(newFormateur);
      
      const current = this.formateursSubject.value;
      this.formateursSubject.next([...current, newFormateur]);
      
      return of(newFormateur);
    }

    return this.http.post<FormateurDTO>(this.apiUrl, formateur)
      .pipe(
        tap(newFormateur => {
          const current = this.formateursSubject.value;
          this.formateursSubject.next([...current, newFormateur]);
        }),
        catchError(error => {
          console.error('Error creating formateur:', error);
          const newId = Math.max(...this.mockFormateurs.map(f => f.id), 0) + 1;
          const newFormateur = { ...formateur, id: newId, formationsCount: 0 };
          this.mockFormateurs.push(newFormateur);
          return of(newFormateur);
        })
      );
  }

  /**
   * Update formateur
   */
  updateFormateur(id: number, formateur: FormateurDTO): Observable<FormateurDTO> {
    if (this.useTestData) {
      const index = this.mockFormateurs.findIndex(f => f.id === id);
      if (index !== -1) {
        this.mockFormateurs[index] = { ...formateur, id };
        
        const current = this.formateursSubject.value;
        const currIndex = current.findIndex(f => f.id === id);
        if (currIndex !== -1) {
          current[currIndex] = { ...formateur, id };
          this.formateursSubject.next([...current]);
        }
      }
      return of({ ...formateur, id });
    }

    return this.http.put<FormateurDTO>(`${this.apiUrl}/${id}`, formateur)
      .pipe(
        tap(updated => {
          const current = this.formateursSubject.value;
          const index = current.findIndex(f => f.id === id);
          if (index !== -1) {
            current[index] = updated;
            this.formateursSubject.next([...current]);
          }
        }),
        catchError(error => {
          console.error('Error updating formateur:', error);
          const index = this.mockFormateurs.findIndex(f => f.id === id);
          if (index !== -1) {
            this.mockFormateurs[index] = { ...formateur, id };
          }
          return of({ ...formateur, id });
        })
      );
  }

  /**
   * Delete formateur
   */
  deleteFormateur(id: number): Observable<void> {
    if (this.useTestData) {
      this.mockFormateurs = this.mockFormateurs.filter(f => f.id !== id);
      
      const current = this.formateursSubject.value;
      this.formateursSubject.next(current.filter(f => f.id !== id));
      
      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const current = this.formateursSubject.value;
          this.formateursSubject.next(current.filter(f => f.id !== id));
        }),
        catchError(error => {
          console.error('Error deleting formateur:', error);
          this.mockFormateurs = this.mockFormateurs.filter(f => f.id !== id);
          return of(void 0);
        })
      );
  }

  /**
   * Get formateurs by type
   */
  getFormateursByType(type: string): Observable<FormateurDTO[]> {
    if (this.useTestData) {
      const formateurs = this.mockFormateurs.filter(f => f.type === type);
      return of([...formateurs]);
    }

    return this.http.get<FormateurDTO[]>(`${this.apiUrl}/type/${type}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formateurs by type:', error);
          const formateurs = this.mockFormateurs.filter(f => f.type === type);
          return of([...formateurs]);
        })
      );
  }

  /**
   * Get internal formateurs
   */
  getInternalFormateurs(): Observable<FormateurDTO[]> {
    return this.getFormateursByType('interne');
  }

  /**
   * Get external formateurs
   */
  getExternalFormateurs(): Observable<FormateurDTO[]> {
    return this.getFormateursByType('externe');
  }

  /**
   * Get current formateurs state
   */
  getCurrentFormateurs(): FormateurDTO[] {
    return this.formateursSubject.value;
  }

  // ==================== EMPLOYEURS ====================

  /**
   * Get all employeurs
   */
  getEmployeurs(): Observable<Employeur[]> {
    if (this.useTestData) {
      this.employeursSubject.next([...this.mockEmployeurs]);
      return of([...this.mockEmployeurs]);
    }

    return this.http.get<Employeur[]>('http://localhost:8080/api/employeurs')
      .pipe(
        tap(data => this.employeursSubject.next(data)),
        catchError(error => {
          console.error('Error loading employeurs:', error);
          this.employeursSubject.next([...this.mockEmployeurs]);
          return of([...this.mockEmployeurs]);
        })
      );
  }

  /**
   * Load employeurs into state
   */
  loadEmployeurs(): void {
    this.getEmployeurs().subscribe();
  }

  /**
   * Get current employeurs state
   */
  getCurrentEmployeurs(): Employeur[] {
    return this.employeursSubject.value;
  }

  /**
   * Enable/disable test data mode
   */
  setTestDataMode(enabled: boolean): void {
    this.useTestData = enabled;
    if (enabled) {
      this.formateursSubject.next([...this.mockFormateurs]);
      this.employeursSubject.next([...this.mockEmployeurs]);
    }
  }

  /**
   * Check if using test data
   */
  isUsingTestData(): boolean {
    return this.useTestData;
  }
}