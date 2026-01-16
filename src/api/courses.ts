import apiClient from "./client";
import {
  TrackedCourse,
  TrackedCourseCreate,
  TrackedCourseUpdate,
} from "../types";

export const coursesApi = {
  async getAll(): Promise<TrackedCourse[]> {
    const response = await apiClient.get<TrackedCourse[]>("/courses");
    return response.data;
  },

  async getById(id: string): Promise<TrackedCourse> {
    const response = await apiClient.get<TrackedCourse>(`/courses/${id}`);
    return response.data;
  },

  async create(data: TrackedCourseCreate): Promise<TrackedCourse> {
    const response = await apiClient.post<TrackedCourse>("/courses", data);
    return response.data;
  },

  async update(id: string, data: TrackedCourseUpdate): Promise<TrackedCourse> {
    const response = await apiClient.patch<TrackedCourse>(
      `/courses/${id}`,
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  },
};
