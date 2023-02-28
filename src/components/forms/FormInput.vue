<template>
  <div>
    <label v-if="label" class="text-slate-700" :for="props.id">{{
      props.label
    }}</label>
    <div
      v-if="props.type === 'password'"
      class="relative mt-2 flex items-center"
    >
      <button
        type="button"
        class="absolute right-0 mr-4 focus:outline-none"
        @click="showPassword = !showPassword"
      >
        <VueIcon v-if="showPassword" name="fa-regular-eye-slash" />
        <VueIcon v-else name="fa-regular-eye" />
      </button>

      <input
        :id="props.id"
        :type="showPassword ? 'text' : 'password'"
        :name="props.name"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        class="block w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-5 pr-11 text-gray-700 placeholder:text-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <input
      v-else
      :id="props.id"
      :name="props.name"
      :placeholder="props.placeholder"
      :type="props.type"
      :value="props.modelValue"
      class="mt-1 block w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
}>();

const showPassword = ref(false);

const props = defineProps<{
  id: string;
  label?: string;
  modelValue: unknown;
  name: string;
  placeholder?: string;
  type: 'text' | 'email' | 'password';
}>();
</script>
