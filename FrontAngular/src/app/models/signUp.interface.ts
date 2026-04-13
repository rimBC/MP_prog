
export interface SignUpRequest {
  login: string;
  password: string;
  passwordConfirm: string;
  roleId: number;
}

export interface SignUpResponse {
  id: number;
  login: string;
  role: string;
  success: boolean;
  message: string;
}
