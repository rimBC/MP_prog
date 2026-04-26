export interface UtilisateurDTO {
  id: number;
  login: string;
  roleId?: number;
  roleName?: string;
  actif: boolean;
  dateCreation?: string;
  dateModification?: string;
}

export interface User {
  id: number;
  login: string;
  role: string;
  actif: boolean;
}
