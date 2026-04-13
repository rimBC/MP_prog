export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  id: number;
  login: string;
  role: string;
  actif: boolean;
  type: string;
}