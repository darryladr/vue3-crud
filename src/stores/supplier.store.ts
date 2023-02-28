import { defineStore } from 'pinia';

import api from '@/common/api';
import type { ISupplier } from '@/common/data';

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    data: null as Record<string, any> | null,
    totalPage: null as number | null,
    totalRecord: null as number | null,
    error: null as string | null,
  }),

  actions: {
    async createSupplier(payload: Record<keyof ISupplier, any>) {
      try {
        const response = await api.post('/supplier/create', payload, {
          timeout: 3000,
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    async updateSupplier(id: string, payload: Record<keyof ISupplier, any>) {
      try {
        const response = await api.put(`/supplier/update/${id}`, payload, {
          timeout: 3000,
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    async deleteSupplier(id: string) {
      try {
        const response = await api.delete(`/supplier/delete/${id}`, {
          timeout: 3000,
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    async fetchSupplier({ limit, offset }: Record<string, number>) {
      try {
        const response = await api.get('/supplier/find-all', {
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
