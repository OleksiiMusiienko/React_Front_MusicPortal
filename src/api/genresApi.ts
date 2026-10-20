import axios from "axios";
import type { Genre } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export const getGenres = async (): Promise<Genre[]> =>
  (await api.get("/Genres")).data;

export const getGenre = async (id: number): Promise<Genre> =>
  (await api.get(`/Genres/${id}`)).data;

export const addGenre = async (user: Omit<Genre, 'id'>) =>  
  api.post('/Genres', user);

export const deleteGenre = async (id: number) =>
  api.delete(`/Genres/${id}`);