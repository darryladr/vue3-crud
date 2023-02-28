Register

<template>
  <div class="grid h-full min-h-screen w-full grid-cols-5 bg-slate-800">
    <form
      class="col-start-3 col-end-6 m-auto flex w-full max-w-lg flex-col rounded-md bg-white p-8 shadow-md"
      @submit="onSubmit"
      @invalid-submit="onInvalidSubmit"
    >
      <h2 class="text-lg font-semibold capitalize text-slate-700">
        Registrasi
      </h2>

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
          id="profileName"
          v-model="profileName"
          name="profileName"
          type="text"
          label="Profile Name"
        />
        <ErrorMessage class="text-red-500" name="profileName" />
        <FormInput
          id="password"
          v-model="password"
          name="password"
          type="text"
          label="Password"
        />
        <ErrorMessage class="text-red-500" name="password" />
        <FormInput
          id="confirmPassword"
          v-model="confirmPassword"
          name="confirmPassword"
          type="text"
          label="Confirm Password"
        />
      </div>
      <ErrorMessage class="text-red-500" name="confirmPassword" />

      <div class="flex items-center justify-between">
        <p>
          Already have an account?
          <router-link to="/login" class="text-blue-500">Login</router-link>
        </p>
        <button
          class="rounded-md bg-blue-500 px-8 py-2.5 leading-5 text-white transition-colors duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { ErrorMessage, useField, useForm } from 'vee-validate';

import { registerSchema } from '@/common/auth';
import { $loading } from '@/common/loading';
import FormInput from '@/components/forms/FormInput.vue';
import router from '@/router';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();

const validationSchema = toFormValidator(registerSchema);
const { handleSubmit, setErrors } = useForm({
  validationSchema,
});

const { value: username } = useField('username');
const { value: profileName } = useField('profileName');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');

const onSubmit = handleSubmit(async (values) => {
  const loader = $loading.show();
  await authStore
    .register(values)
    .then(() => {
      loader.hide();
      router.push('/dashboard/supplier');
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error(error.message);
        setErrors({ confirmPassword: error.message });
      }
    });
});

const onInvalidSubmit = () => {
  const submitBtn = document.getElementById('submit');
  if (submitBtn) {
    submitBtn.classList.add('invalid-submit');
    setTimeout(() => {
      submitBtn.classList.remove('invalid-submit');
    }, 1000);
  }
};
</script>

<style>
.invalid-submit {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-2px);
  }
  20% {
    transform: translateX(2px);
  }
  30% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  50% {
    transform: translateX(-2px);
  }
  60% {
    transform: translateX(2px);
  }
  70% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
  90% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
