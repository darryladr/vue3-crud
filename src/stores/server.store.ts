import { defineStore } from 'pinia';

export const useServerStore = defineStore('supplier', {
  state: () => ({
    perPage: 20,
    currentPage: 1,
    totalPage: null as number | null,
    totalRecord: null as number | null,
  }),
});
