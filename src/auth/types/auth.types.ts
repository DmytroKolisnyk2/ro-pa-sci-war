export interface LoginResponse { 
  token: string;
}

export interface JwtPayload { 
  username: string;
  id: number;
}