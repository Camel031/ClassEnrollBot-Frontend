import axios from "axios";
import { Token, User, LoginCredentials, RegisterData } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<Token> {
    const response = await axios.post<Token>(
      `${API_URL}/api/v1/auth/login`,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await axios.post<User>(
      `${API_URL}/api/v1/auth/register`,
      data
    );
    return response.data;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await axios.get<User>(`${API_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<Token> {
    const response = await axios.post<Token>(
      `${API_URL}/api/v1/auth/refresh`,
      {},
      {
        params: { refresh_token: refreshToken },
      }
    );
    return response.data;
  },
};
