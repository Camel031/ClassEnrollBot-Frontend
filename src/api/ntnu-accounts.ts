import apiClient from "./client";
import { NtnuAccount, NtnuAccountCreate } from "../types";

export const ntnuAccountsApi = {
  async getAll(): Promise<NtnuAccount[]> {
    const response = await apiClient.get<NtnuAccount[]>("/ntnu-accounts");
    return response.data;
  },

  async getById(id: string): Promise<NtnuAccount> {
    const response = await apiClient.get<NtnuAccount>(`/ntnu-accounts/${id}`);
    return response.data;
  },

  async create(data: NtnuAccountCreate): Promise<NtnuAccount> {
    const response = await apiClient.post<NtnuAccount>("/ntnu-accounts", data);
    return response.data;
  },

  async update(
    id: string,
    data: { password?: string; is_active?: boolean }
  ): Promise<NtnuAccount> {
    const response = await apiClient.patch<NtnuAccount>(
      `/ntnu-accounts/${id}`,
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/ntnu-accounts/${id}`);
  },

  async login(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/ntnu-accounts/${id}/login`);

    // Check if login actually succeeded (backend returns 200 even on failure)
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data;
  },
};
