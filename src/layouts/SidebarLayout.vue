<template>
  <nav
    x-data="{ isOpen: false }"
    class="fixed right-0 z-[1] w-[calc(100%-18rem)] border-b border-slate-300 bg-white"
  >
    <div
      class="container mx-auto flex h-16 items-center justify-between px-4 py-5"
    >
      <span class="font-medium">Dashboard</span>

      <button
        class="rounded-md font-medium leading-5 text-red-500 transition-colors duration-300 hover:text-red-600 focus:text-red-600 focus:outline-none"
        @click="logout"
      >
        <span>
          Logout
          <VueIcon class="ml-1" name="md-logout-round" scale="1.25" />
        </span>
      </button>
    </div>
  </nav>
  <aside
    class="absolute flex h-screen w-72 flex-col overflow-y-auto border-r border-slate-300 bg-white px-4 py-8"
  >
    <nav class="flex flex-1 flex-col gap-4">
      <div class="flex items-center">
        <VueIcon name="fa-user-circle" scale="1.5" />
        <div class="ml-3 flex flex-col">
          <span class="font-medium text-slate-800">{{
            authStore.user.profileName
          }}</span>
          <span class="text-sm text-slate-500"
            >@{{ authStore.user.username }}</span
          >
        </div>
      </div>

      <hr class="border-slate-200" />

      <router-link
        v-for="link in sidebarLinks"
        :key="link.to"
        :to="link.to"
        :class="[
          isActive(link) ? 'bg-slate-100' : '',
          'flex items-center rounded-md px-4 py-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100',
        ]"
      >
        <VueIcon name="md-spacedashboard-round" />

        <span class="mx-4 font-medium">{{ link.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const route = useRoute();

const sidebarLinks = ref([
  {
    name: 'Supplier',
    to: '/dashboard/supplier',
  },
  {
    name: 'Barang',
    to: '/dashboard/barang',
  },
]);

function isActive(link: { to: string }) {
  return link.to === route.path;
}

function logout() {
  authStore.logout();
  location.reload();
}
</script>
