export interface JwtPayload {
  exp: number;
  iat?: number;
  userId?: number;
  email?: string;
  roles?: string[];
  [key: string]: any;
}
