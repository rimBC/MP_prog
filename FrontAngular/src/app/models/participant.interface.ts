export interface ParticipantDTO {
  id?: number;
  nom: string;
  prenom: string;
  structureId?: number;
  structureLibelle?: string;
  profilId?: number;
  profilLibelle?: string;
  email?: string;
  tel?: string;
  dateEmbauche?: string;
  actif?: boolean;
}
