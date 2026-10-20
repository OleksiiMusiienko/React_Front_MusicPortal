import axios from 'axios';
import type {User} from "../types/types";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export const getUsers = async (): Promise<User[]> =>
  (await api.get('/Users')).data;

export const getUser = async (id: number): Promise<User> =>
  (await api.get(`/Users/${id}`)).data;

export const addUser = async (user: Omit<User, 'id'|'salt'>) =>  //Omit убирает id из обьекта
  api.post('/Users', user);

export const editUser = async (user: Omit<User, 'salt'>) =>
  api.put(`/Users/${user.id}`, user);

export const deleteUser = async (id: number) =>
  api.delete(`/Users/${id}`);