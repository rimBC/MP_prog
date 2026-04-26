export interface StructureDTO {
  id?: number;
  libelle: string;
  description?: string;
  lieu?: string;
  nombreParticipants?: number;
}

export type Structure = StructureDTO;
