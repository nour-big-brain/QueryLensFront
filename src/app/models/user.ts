export interface User {
  _id: string;
  userId: string;
  username: string;
  email: string;
  isActive: boolean;
  deletedAt: Date | null;
  roleId: string | null;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}