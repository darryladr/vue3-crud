import jwt_decode, { type JwtPayload } from 'jwt-decode';
import { defineStore } from 'pinia';

import api from '@/common/api';
import type { ILogin, IRegister, IUser } from '@/common/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.user;
    },
    currentUser(): IUser {
      return this.user;
    },
  },

  actions: {
    async register({ ...credentials }: Record<keyof IRegister, string>) {
      try {
        const response = await api.post(
          '/auth/register',
          {
            ...credentials,
          },
          { timeout: 3000 }
        );
        const { data } = response.data;
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
          throw error;
        }
      }
    },

    async login({ ...credentials }: Record<keyof ILogin, string>) {
      try {
        const response = await api.post(
          '/auth/login',
          {
            ...credentials,
          },
          { timeout: 3000 }
        );

        const { data } = response.data;

        if (response.status === 200 && !data) {
          throw new Error('Invalid credentials');
        }

        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
          throw error;
        }
      }
    },

    checkTokenExpiration(): void {
      const token = this.user?.token;
      if (token) {
        const decoded: JwtPayload = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          this.logout();
        }
      }
    },

    logout() {
      this.error = null;
      localStorage.removeItem('user');
      delete api.defaults.headers.common.Authorization;
    },
  },
});
