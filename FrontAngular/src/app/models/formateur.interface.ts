export interface FormateurDTO {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  tel?: string;
  type: string;
  employeurId?: number;
  employeurNom?: string;
  specialite?: string;
  bio?: string;
}

export type Formateur = FormateurDTO;
