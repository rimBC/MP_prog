import { FormationDTO } from '../../models/formationDTO.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Formateur } from '../../models/formateur.interface';




@Injectable({
  providedIn: 'root'
})
export class FormationService {
  
  private apiUrl = 'http://localhost:8080/api/formations';
  
  private formationsSubject = new BehaviorSubject<FormationDTO[]>([]);
  public formations$ = this.formationsSubject.asObservable();
  
  private domainesSubject = new BehaviorSubject<Domaine[]>([]);
  public domaines$ = this.domainesSubject.asObservable();
  
  private formateursSubject = new BehaviorSubject<Formateur[]>([]);
  public formateurs$ = this.formateursSubject.asObservable();

  // ==================== TEST DATA ====================
  private mockDomaines: Domaine[] = [
    { id: 1, libelle: 'IT & Technology', description: 'Information Technology trainings' },
    { id: 2, libelle: 'Management', description: 'Management and leadership trainings' },
    { id: 3, libelle: 'Finance', description: 'Financial and accounting trainings' },
    { id: 4, libelle: 'HR', description: 'Human Resources trainings' },
    { id: 5, libelle: 'Sales', description: 'Sales and marketing trainings' },
    { id: 6, libelle: 'Communication', description: 'Communication and soft skills' },
    { id: 7, libelle: 'Quality', description: 'Quality assurance and control' },
    { id: 8, libelle: 'Operations', description: 'Operations and process management' }
  ];

  private mockFormateurs: Formateur[] = [
    { id: 1, nom: 'Johnson', prenom: 'Michael', email: 'michael.johnson@example.com', type: 'interne' },
    { id: 2, nom: 'Smith', prenom: 'Sarah', email: 'sarah.smith@example.com', type: 'interne' },
    { id: 3, nom: 'Williams', prenom: 'David', email: 'david.williams@example.com', type: 'externe' },
    { id: 4, nom: 'Brown', prenom: 'Jennifer', email: 'jennifer.brown@example.com', type: 'interne' },
    { id: 5, nom: 'Davis', prenom: 'Robert', email: 'robert.davis@example.com', type: 'externe' },
    { id: 6, nom: 'Miller', prenom: 'Lisa', email: 'lisa.miller@example.com', type: 'interne' }
  ];

  private mockFormations: FormationDTO[] = [
    {
      id: 1,
      titre: 'Angular Advanced Development',
      annee: 2024,
      duree: 40,
      budget: 5000,
      lieu: 'Tunis',
      dateDebut: '2024-03-15',
      dateFin: '2024-04-15',
      statut: 'EN_COURS',
      description: 'Advanced Angular framework training covering reactive patterns and performance optimization',
      domaineId: 1,
      domaineName: 'IT & Technology',
      formateurId: 1,
      formateurNom: 'Michael Johnson',
      participantCount: 15
    },
    {
      id: 2,
      titre: 'Leadership Excellence',
      annee: 2024,
      duree: 24,
      budget: 3500,
      lieu: 'Sousse',
      dateDebut: '2024-02-01',
      dateFin: '2024-03-15',
      statut: 'COMPLETEE',
      description: 'Comprehensive leadership program for middle and senior managers',
      domaineId: 2,
      domaineName: 'Management',
      formateurId: 2,
      formateurNom: 'Sarah Smith',
      participantCount: 20
    },
    {
      id: 3,
      titre: 'Financial Analysis & Planning',
      annee: 2024,
      duree: 32,
      budget: 4000,
      lieu: 'Sfax',
      dateDebut: '2024-04-01',
      dateFin: '2024-05-10',
      statut: 'PLANIFIEE',
      description: 'In-depth training on financial analysis tools and strategic planning',
      domaineId: 3,
      domaineName: 'Finance',
      formateurId: 3,
      formateurNom: 'David Williams',
      participantCount: 12
    },
    {
      id: 4,
      titre: 'Cloud Computing with AWS',
      annee: 2024,
      duree: 48,
      budget: 6500,
      lieu: 'Tunis',
      dateDebut: '2024-05-15',
      dateFin: '2024-07-15',
      statut: 'PLANIFIEE',
      description: 'Comprehensive AWS cloud platform training with hands-on labs',
      domaineId: 1,
      domaineName: 'IT & Technology',
      formateurId: 4,
      formateurNom: 'Jennifer Brown',
      participantCount: 18
    },
    {
      id: 5,
      titre: 'HR Compliance & Labor Law',
      annee: 2024,
      duree: 20,
      budget: 2500,
      lieu: 'Tunis',
      dateDebut: '2024-03-20',
      dateFin: '2024-04-10',
      statut: 'EN_COURS',
      description: 'Updates on labor laws and HR compliance requirements',
      domaineId: 4,
      domaineName: 'HR',
      formateurId: 5,
      formateurNom: 'Robert Davis',
      participantCount: 25
    },
    {
      id: 6,
      titre: 'Python for Data Science',
      annee: 2024,
      duree: 56,
      budget: 7000,
      lieu: 'Sfax',
      dateDebut: '2024-06-01',
      dateFin: '2024-08-15',
      statut: 'PLANIFIEE',
      description: 'Master Python programming for data analysis and machine learning',
      domaineId: 1,
      domaineName: 'IT & Technology',
      formateurId: 2,
      formateurNom: 'Sarah Smith',
      participantCount: 16
    },
    {
      id: 7,
      titre: 'Effective Communication Skills',
      annee: 2024,
      duree: 16,
      budget: 2000,
      lieu: 'Sousse',
      dateDebut: '2024-04-15',
      dateFin: '2024-05-05',
      statut: 'EN_COURS',
      description: 'Enhance communication and interpersonal skills for workplace success',
      domaineId: 6,
      domaineName: 'Communication',
      formateurId: 6,
      formateurNom: 'Lisa Miller',
      participantCount: 22
    },
    {
      id: 8,
      titre: 'Quality Management Systems',
      annee: 2023,
      duree: 24,
      budget: 3000,
      lieu: 'Tunis',
      dateDebut: '2023-10-01',
      dateFin: '2023-11-15',
      statut: 'COMPLETEE',
      description: 'ISO 9001 and quality management principles implementation',
      domaineId: 7,
      domaineName: 'Quality',
      formateurId: 1,
      formateurNom: 'Michael Johnson',
      participantCount: 14
    },
    {
      id: 9,
      titre: 'Sales Excellence Program',
      annee: 2024,
      duree: 28,
      budget: 3500,
      lieu: 'Sfax',
      dateDebut: '2024-05-20',
      dateFin: '2024-06-30',
      statut: 'PLANIFIEE',
      description: 'Advanced sales techniques and customer relationship management',
      domaineId: 5,
      domaineName: 'Sales',
      formateurId: 4,
      formateurNom: 'Jennifer Brown',
      participantCount: 19
    },
    {
      id: 10,
      titre: 'Process Optimization',
      annee: 2024,
      duree: 20,
      budget: 2800,
      lieu: 'Tunis',
      dateDebut: '2024-07-01',
      dateFin: '2024-08-01',
      statut: 'PLANIFIEE',
      description: 'Lean methodology and process improvement techniques',
      domaineId: 8,
      domaineName: 'Operations',
      formateurId: 3,
      formateurNom: 'David Williams',
      participantCount: 17
    }
  ];

  private useTestData = true; // Toggle to false to use real API

  constructor(private http: HttpClient) {
    this.loadFormations();
    this.loadDomaines();
    this.loadFormateurs();
  }

  // ==================== FORMATIONS ====================

  /**
   * Get all formations
   */
  getFormations(): Observable<FormationDTO[]> {
    if (this.useTestData) {
      this.formationsSubject.next([...this.mockFormations]);
      return of([...this.mockFormations]);
    }

    return this.http.get<FormationDTO[]>(this.apiUrl)
      .pipe(
        tap(data => this.formationsSubject.next(data)),
        catchError(error => {
          console.error('Error loading formations:', error);
          this.formationsSubject.next([...this.mockFormations]);
          return of([...this.mockFormations]);
        })
      );
  }

  /**
   * Load formations into state
   */
  loadFormations(): void {
    this.getFormations().subscribe();

  }

  /**
   * Get formation by ID
   */
  getFormationById(id: number): Observable<FormationDTO> {
    if (this.useTestData) {
      const formation = this.mockFormations.find(f => f.id === id);
      return of(formation || {} as FormationDTO);
    }

    return this.http.get<FormationDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formation:', error);
          const formation = this.mockFormations.find(f => f.id === id);
          return of(formation || {} as FormationDTO);
        })
      );
  }

  /**
   * Create formation
   */
  createFormation(formation: FormationDTO): Observable<FormationDTO> {
    if (this.useTestData) {
      const newId = Math.max(...this.mockFormations.map(f => f.id), 0) + 1;
      const newFormation = { ...formation, id: newId };
      this.mockFormations.push(newFormation);
      
      const current = this.formationsSubject.value;
      this.formationsSubject.next([...current, newFormation]);
      
      return of(newFormation);
    }

    return this.http.post<FormationDTO>(this.apiUrl, formation)
      .pipe(
        tap(newFormation => {
          const current = this.formationsSubject.value;
          this.formationsSubject.next([...current, newFormation]);
        }),
        catchError(error => {
          console.error('Error creating formation:', error);
          const newId = Math.max(...this.mockFormations.map(f => f.id), 0) + 1;
          const newFormation = { ...formation, id: newId };
          this.mockFormations.push(newFormation);
          return of(newFormation);
        })
      );
  }

  /**
   * Update formation
   */
  updateFormation(id: number, formation: FormationDTO): Observable<FormationDTO> {
    if (this.useTestData) {
      const index = this.mockFormations.findIndex(f => f.id === id);
      if (index !== -1) {
        this.mockFormations[index] = { ...formation, id };
        
        const current = this.formationsSubject.value;
        const currIndex = current.findIndex(f => f.id === id);
        if (currIndex !== -1) {
          current[currIndex] = { ...formation, id };
          this.formationsSubject.next([...current]);
        }
      }
      return of({ ...formation, id });
    }

    return this.http.put<FormationDTO>(`${this.apiUrl}/${id}`, formation)
      .pipe(
        tap(updated => {
          const current = this.formationsSubject.value;
          const index = current.findIndex(f => f.id === id);
          if (index !== -1) {
            current[index] = updated;
            this.formationsSubject.next([...current]);
          }
        }),
        catchError(error => {
          console.error('Error updating formation:', error);
          const index = this.mockFormations.findIndex(f => f.id === id);
          if (index !== -1) {
            this.mockFormations[index] = { ...formation, id };
          }
          return of({ ...formation, id });
        })
      );
  }

  /**
   * Delete formation
   */
  deleteFormation(id: number): Observable<void> {
    if (this.useTestData) {
      this.mockFormations = this.mockFormations.filter(f => f.id !== id);
      
      const current = this.formationsSubject.value;
      this.formationsSubject.next(current.filter(f => f.id !== id));
      console.log(this.getCurrentFormations())
      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const current = this.formationsSubject.value;
          this.formationsSubject.next(current.filter(f => f.id !== id));
        }),
        catchError(error => {
          console.error('Error deleting formation:', error);
          this.mockFormations = this.mockFormations.filter(f => f.id !== id);
          return of(void 0);
        })
      );
  }

  /**
   * Get formations by year
   */
  getFormationsByYear(year: number): Observable<FormationDTO[]> {
    if (this.useTestData) {
      const formations = this.mockFormations.filter(f => f.annee === year);
      return of([...formations]);
    }

    return this.http.get<FormationDTO[]>(`${this.apiUrl}/year/${year}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formations by year:', error);
          const formations = this.mockFormations.filter(f => f.annee === year);
          return of([...formations]);
        })
      );
  }

  /**
   * Get formations by domain
   */
  getFormationsByDomain(domaineId: number): Observable<FormationDTO[]> {
    if (this.useTestData) {
      const formations = this.mockFormations.filter(f => f.domaineId === domaineId);
      return of([...formations]);
    }

    return this.http.get<FormationDTO[]>(`${this.apiUrl}/domain/${domaineId}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formations by domain:', error);
          const formations = this.mockFormations.filter(f => f.domaineId === domaineId);
          return of([...formations]);
        })
      );
  }

  /**
   * Get formations by status
   */
  getFormationsByStatus(status: string): Observable<FormationDTO[]> {
    if (this.useTestData) {
      const formations = this.mockFormations.filter(f => f.statut === status);
      return of([...formations]);
    }

    return this.http.get<FormationDTO[]>(`${this.apiUrl}/status/${status}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formations by status:', error);
          const formations = this.mockFormations.filter(f => f.statut === status);
          return of([...formations]);
        })
      );
  }

  /**
   * Get formations by formateur
   */
  getFormationsByFormateur(formateurId: number): Observable<FormationDTO[]> {
    if (this.useTestData) {
      const formations = this.mockFormations.filter(f => f.formateurId === formateurId);
      return of([...formations]);
    }

    return this.http.get<FormationDTO[]>(`${this.apiUrl}/formateur/${formateurId}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formations by formateur:', error);
          const formations = this.mockFormations.filter(f => f.formateurId === formateurId);
          return of([...formations]);
        })
      );
  }

  /**
   * Get formations by date range
   */
  getFormationsByDateRange(startDate: string, endDate: string): Observable<FormationDTO[]> {
    if (this.useTestData) {
      const formations = this.mockFormations.filter(f => 
        f.dateDebut >= startDate && f.dateFin <= endDate
      );
      return of([...formations]);
    }

    return this.http.get<FormationDTO[]>(`${this.apiUrl}/daterange?startDate=${startDate}&endDate=${endDate}`)
      .pipe(
        catchError(error => {
          console.error('Error loading formations by date range:', error);
          const formations = this.mockFormations.filter(f => 
            f.dateDebut >= startDate && f.dateFin <= endDate
          );
          return of([...formations]);
        })
      );
  }

  /**
   * Get current formations state
   */
  getCurrentFormations(): FormationDTO[] {
    return this.formationsSubject.value;
  }

  // ==================== DOMAINES ====================

  /**
   * Get all domaines
   */
  getDomaines(): Observable<Domaine[]> {
    if (this.useTestData) {
      this.domainesSubject.next([...this.mockDomaines]);
      return of([...this.mockDomaines]);
    }

    return this.http.get<Domaine[]>('http://localhost:8080/api/reference/domaines')
      .pipe(
        tap(data => this.domainesSubject.next(data)),
        catchError(error => {
          console.error('Error loading domaines:', error);
          this.domainesSubject.next([...this.mockDomaines]);
          return of([...this.mockDomaines]);
        })
      );
  }

  /**
   * Load domaines into state
   */
  loadDomaines(): void {
    this.getDomaines().subscribe();
  }

  /**
   * Get current domaines state
   */
  getCurrentDomaines(): Domaine[] {
    return this.domainesSubject.value;
  }

  // ==================== FORMATEURS ====================

  /**
   * Get all formateurs
   */
  getFormateurs(): Observable<Formateur[]> {
    if (this.useTestData) {
      this.formateursSubject.next([...this.mockFormateurs]);
      return of([...this.mockFormateurs]);
    }

    return this.http.get<Formateur[]>('http://localhost:8080/api/formateurs')
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
   * Get current formateurs state
   */
  getCurrentFormateurs(): Formateur[] {
    return this.formateursSubject.value;
  }

  /**
   * Enable/disable test data mode
   */
  setTestDataMode(enabled: boolean): void {
    this.useTestData = enabled;
    if (enabled) {
      this.formationsSubject.next([...this.mockFormations]);
      this.domainesSubject.next([...this.mockDomaines]);
      this.formateursSubject.next([...this.mockFormateurs]);
    }
  }

  /**
   * Check if using test data
   */
  isUsingTestData(): boolean {
    return this.useTestData;
  }
}