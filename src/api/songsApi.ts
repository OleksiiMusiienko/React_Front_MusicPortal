import axios from 'axios';
import type { Song } from "../types/types";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export const getSongs = async (): Promise<Song[]> =>
  (await api.get('/Songs')).data;

export const getSong = async (id: number): Promise<Song> =>
  (await api.get(`/Songs/${id}`)).data;

export const addSong = async (
  formData: FormData) => api.post('/Songs', formData);

export const editSong = async (
  song: Omit<Song, 'genre'>
) =>
  api.put('/Songs', song); 
  
export const deleteSong = async (id: number) =>
  api.delete(`/Songs/${id}`);