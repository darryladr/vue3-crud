<template>
  <VueFinalModal
    class="flex items-center justify-center"
    content-class="flex w-full max-w-lg flex-col rounded-md bg-white p-8 shadow-md"
  >
    <h1 class="text-xl">{{ title }}</h1>
    <form @submit="onSubmit" @invalid-submit="onInvalidSubmit">
      <h2 class="text-lg font-semibold capitalize text-slate-700">
        Create New Entry
      </h2>

      <div
        v-if="$route.params.id === 'supplier'"
        class="my-4 flex flex-col gap-4"
      >
        <FormInput
          id="namaSupplier"
          key="namaSupplier"
          v-model="namaSupplier"
          name="namaSupplier"
          type="text"
          label="Nama Supplier"
        />
        <FormInput
          id="noTelp"
          key="noTelp"
          v-model="noTelp"
          name="noTelp"
          type="text"
          label="No. Telp"
        />
        <FormInput
          id="alamat"
          key="alamat"
          v-model="alamat"
          name="alamat"
          type="text"
          label="Alamat"
        />
      </div>
      <button
        type="submit"
        class="rounded-md bg-blue-500 px-8 py-2.5 leading-5 text-white transition-colors duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
        @click="emit('confirm')"
      >
        Submit
      </button>
    </form>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { VueFinalModal } from 'vue-final-modal';

import { supplierSchema } from '@/common/data';
import { $loading } from '@/common/loading';
import FormInput from '@/components/forms/FormInput.vue';
import { useSupplierStore } from '@/stores';

defineProps<{ title?: string }>();
const emit = defineEmits<{ (e: 'confirm'): void }>();

const supplierStore = useSupplierStore();

const validationSchema = toFormValidator(supplierSchema);
const { handleSubmit, setErrors } = useForm({
  validationSchema,
  initialValues: {
    id: '',
    namaSupplier: '',
    noTelp: '',
    alamat: '',
  },
});

const { value: namaSupplier } = useField('namaSupplier');
const { value: noTelp } = useField('noTelp');
const { value: alamat } = useField('alamat');

const onInvalidSubmit = () => {
  const submitBtn = document.getElementById('submit');
  if (submitBtn) {
    submitBtn.classList.add('invalid-submit');
    setTimeout(() => {
      submitBtn.classList.remove('invalid-submit');
    }, 1000);
  }
};

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  const loader = $loading.show();
  await supplierStore
    .createSupplier(values)
    .then(() => {
      loader.hide();
      resetForm();
    })
    .catch((error) => {
      if (error instanceof Error) {
        setErrors({ alamat: error.message });
      }
    });
}, onInvalidSubmit);
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
