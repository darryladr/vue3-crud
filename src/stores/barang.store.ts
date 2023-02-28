import { defineStore } from 'pinia';

import api from '@/common/api';
import type { IBarang } from '@/common/data';

export const useBarangStore = defineStore('barang', {
  state: () => ({
    data: null as Record<string, any> | null,
    totalPage: null as number | null,
    totalRecord: null as number | null,
    error: null as string | null,
  }),

  actions: {
    async createBarang(payload: Record<keyof IBarang, any>) {
      try {
        const response = await api.post('/barang/create', payload, {
          timeout: 3000,
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    async updateBarang(id: string, payload: Record<keyof IBarang, any>) {
      try {
        const response = await api.put(`/barang/update/${id}`, payload, {
          timeout: 3000,
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    async deleteBarang(id: string) {
      try {
        const response = await api.delete(`/barang/delete/${id}`, {
          timeout: 3000,
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    async fetchBarang({ limit, offset }: Record<string, number>) {
      try {
        const response = await api.get('/barang/find-all', {
          params: {
            limit: limit,
            offset: offset,
          },
        });
        this.totalPage = response.data.total_page;
        this.totalRecord = response.data.total_record;
        const { data } = response.data;
        this.data = data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },
  },
});
