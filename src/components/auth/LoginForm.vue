<template>
  <div class="grid h-full min-h-screen w-full grid-cols-5 bg-slate-800">
    <form
      class="col-start-3 col-end-6 m-auto flex w-full max-w-lg flex-col rounded-md bg-white p-8 shadow-md"
      @submit="onSubmit"
    >
      <h2 class="text-lg font-semibold capitalize text-slate-700">Login</h2>

      <div class="my-4 flex flex-col gap-4">
        <FormInput
          id="username"
          v-model="username"
          name="username"
          type="text"
          label="Username"
        />
        <ErrorMessage class="text-red-500" name="username" />
        <FormInput
          id="password"
          v-model="password"
          name="password"
          type="password"
          label="Password"
        />
        <ErrorMessage class="text-red-500" name="password" />
      </div>

      <div v-if="authStore.error" class="text-red-500">
        {{ authStore.error }}
      </div>

      <div class="flex items-center justify-between">
        <p>
          Don't have an account?
          <router-link to="/register" class="text-blue-500"
            >Register</router-link
          >
        </p>
        <button
          :disabled="loading"
          class="rounded-md bg-blue-500 px-5 py-2.5 leading-5 text-white transition-colors duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
        >
          <span v-if="loading" class="flex items-center justify-between gap-1">
            <VueIcon name="pr-spinner" />
            Logging in...
          </span>
          <span v-else> Login </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, useField, useForm } from 'vee-validate';
import { ref } from 'vue';

import { $loading } from '@/common/loading';
import FormInput from '@/components/forms/FormInput.vue';
import router from '@/router';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const loading = ref(false);

const { handleSubmit, setErrors } = useForm({});

const { value: username } = useField('username');
const { value: password } = useField('password');

const onSubmit = handleSubmit(async (values) => {
  const loader = $loading.show();
  console.log(values);
  await authStore
    .login(values)
    .then(() => {
      loader.hide();
      router.push('/dashboard/supplier');
    })
    .catch((error) => {
      loader.hide();
      if (error instanceof Error) {
        setErrors({ password: error.message });
      }
    });
});
</script>
