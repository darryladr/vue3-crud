<template>
  <main>
    <RouterView name="sidebar" />
    <RouterView name="navbar" />
    <RouterView />
    <ModalsContainer />
  </main>
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import { RouterView } from 'vue-router';
</script>
