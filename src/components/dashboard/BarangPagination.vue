<template>
  <div
    class="container mx-auto flex h-10 flex-col items-center space-y-6 sm:flex-row sm:justify-between sm:space-y-0"
  >
    <div class="flex items-center gap-2">
      <button
        type="button"
        href="#"
        class="flex items-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-slate-700 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit"
        :disabled="serverParams.offset === 1 ? true : false"
        @click="prevPage"
      >
        <VueIcon name="pr-arrow-left" />
        <span> Previous </span>
      </button>

      <div>
        <a
          v-if="serverParams.offset === barangStore.totalPage!"
          href="#"
          class="mx-2 inline-flex items-center justify-center rounded-lg px-4 py-1 text-slate-700 transition-colors duration-300 hover:bg-slate-100"
          @click="goToPage(serverParams.offset - 1)"
        >
          {{ serverParams.offset - 2 }}
        </a>

        <a
          v-if="serverParams.offset > 1"
          href="#"
          class="mx-2 inline-flex items-center justify-center rounded-lg px-4 py-1 text-slate-700 transition-colors duration-300 hover:bg-slate-100"
          @click="goToPage(serverParams.offset - 1)"
        >
          {{ serverParams.offset - 1 }}
        </a>

        <div
          class="mx-2 inline-flex items-center justify-center rounded-lg bg-blue-100/50 px-4 py-1 text-blue-500 transition-colors duration-300"
        >
          {{ serverParams.offset }}
        </div>

        <a
          v-if="serverParams.offset < barangStore.totalPage!"
          href="#"
          class="mx-2 inline-flex items-center justify-center rounded-lg px-4 py-1 text-slate-700 transition-colors duration-300 hover:bg-slate-100"
          @click="goToPage(serverParams.offset + 1)"
        >
          {{ serverParams.offset + 1 }}
        </a>

        <a
          v-if="serverParams.offset === 1"
          class="mx-2 inline-flex items-center justify-center rounded-lg px-4 py-1 text-slate-700 transition-colors duration-300 hover:bg-slate-100"
          @click="goToPage(serverParams.offset + 2)"
        >
          {{ serverParams.offset + 2 }}
        </a>
      </div>

      <button
        href="#"
        type="button"
        class="flex items-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-slate-700 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit"
        :disabled="serverParams.offset === barangStore.totalPage! ? true : false"
        @click="nextPage"
      >
        <span> Next </span>
        <VueIcon name="pr-arrow-right" />
      </button>
    </div>

    <div class="text-slate-500">
      <span class="font-medium text-slate-700"
        >{{ firstRecord }} - {{ lastRecord }}</span
      >
      of {{ barangStore.totalRecord }} records
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useBarangStore, useServerStore } from '@/stores';

const firstRecord = ref(1);
const lastRecord = ref(20);
const barangStore = useBarangStore();
const serverStore = useServerStore();

const emit = defineEmits(['fetchBarang']);

const serverParams = ref({
  offset: 1,
  limit: 20,
});

const nextPage = () => {
  if (serverParams.value.offset === barangStore.totalPage) return;
  else {
    serverParams.value.offset += 1;
    firstRecord.value += serverParams.value.limit;
    lastRecord.value = Math.min(
      serverParams.value.offset * serverParams.value.limit,
      barangStore.totalRecord!
    );
  }
  emit('fetchBarang', serverStore);
};

const prevPage = () => {
  if (serverParams.value.offset === 1) return;
  else {
    serverParams.value.offset -= 1;

    firstRecord.value -= serverParams.value.limit;
    lastRecord.value = Math.min(
      serverParams.value.offset * serverParams.value.limit,
      barangStore.totalRecord!
    );
  }
  emit('fetchBarang', serverStore);
};

const goToPage = (page: number) => {
  serverParams.value.offset = page;
  firstRecord.value = (page - 1) * serverParams.value.limit + 1;
  lastRecord.value = Math.min(
    serverParams.value.offset * serverParams.value.limit,
    barangStore.totalRecord!
  );
  emit('fetchBarang', serverStore);
};
</script>
