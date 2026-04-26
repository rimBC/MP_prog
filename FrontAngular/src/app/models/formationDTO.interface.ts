export interface FormationDTO {
  id?: number;
  titre: string;
  annee: number;
  duree: number;
  domaineId?: number;
  domaineLibelle?: string;
  budget?: number;
  formateurId?: number;
  formateurNom?: string;
  lieu?: string;
  dateDebut?: string;
  dateFin?: string;
  dateCreation?: string;
  statut?: string;
  description?: string;
  participantIds?: number[];
  nombreParticipants?: number;
}
