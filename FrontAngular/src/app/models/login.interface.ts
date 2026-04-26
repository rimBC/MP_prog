export interface AuthRequest {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  login: string;
  role: string;
  actif: boolean;
}

export type LoginRequest = AuthRequest;
export type LoginResponse = AuthResponse;
