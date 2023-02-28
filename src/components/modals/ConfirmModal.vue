<template>
  <VueFinalModal
    class="flex items-center justify-center"
    content-class="w-full max-w-lg flex-col rounded-md bg-white p-8 shadow-md"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <h1 class="text-xl">{{ title }}</h1>
    <div class="my-4">
      <slot />
    </div>
    <button
      type="submit"
      class="rounded-md bg-blue-500 px-8 py-2.5 leading-5 text-white transition-colors duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
      @click="emit('confirm')"
    >
      Confirm
    </button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
defineProps<{ title?: string }>();
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
  (e: 'confirm'): void;
}>();
</script>
