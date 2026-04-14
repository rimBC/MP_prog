export interface FormationDTO {
  id: number;
  titre: string;
  annee: number;
  duree: number;
  budget: number;
  lieu: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  description: string;
  domaineId: number;
  domaineName?: string;
  formateurId: number;
  formateurNom?: string;
  participantCount?: number;
}