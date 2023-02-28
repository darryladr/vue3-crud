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

      <div class="my-4 flex flex-col gap-4">
        <FormInput
          id="namaBarang"
          key="namaBarang"
          v-model="namaBarang"
          name="namaBarang"
          type="text"
          label="Nama Barang"
        />
        <FormInput
          id="harga"
          key="harga"
          v-model="harga"
          name="harga"
          type="text"
          label="Harga"
        />
        <FormInput
          id="stok"
          key="stok"
          v-model="stok"
          name="stok"
          type="text"
          label="Stok"
        />
        <Field v-slot="{ field }" name="supplier">
          <MultiSelect
            v-bind="field"
            v-model="field.value"
            :options="options"
            :close-on-select="true"
            :clear-on-select="false"
            placeholder="Select one"
            track-by="namaSupplier"
            :custom-label="customLabel"
            @select="onSelect(field)"
          ></MultiSelect>
        </Field>
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
import { Field, useField, useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';

import type { ISupplier } from '@/common/data';
import { $loading } from '@/common/loading';
import FormInput from '@/components/forms/FormInput.vue';
import { useBarangStore, useSupplierStore } from '@/stores';

defineProps<{ title?: string }>();
const emit = defineEmits<{ (e: 'confirm'): void }>();

const barangStore = useBarangStore();
const supplierStore = useSupplierStore();

const options = ref<ISupplier[]>([]);
const { handleSubmit, setErrors } = useForm({
  initialValues: {
    id: '0',
    namaBarang: '',
    harga: '',
    stok: '',
    supplier: {
      id: '0',
      namaSupplier: '',
      noTelp: '',
      alamat: '',
    },
  },
});

const { value: namaBarang } = useField('namaBarang');
const { value: harga } = useField('harga');
const { value: stok } = useField('stok');

onMounted(() => {
  getOptions();
});

const onSelect = (params: any) => {
  console.log(JSON.stringify(params.value, null, 2));
};

const customLabel = (params: { id: string; namaSupplier: string }) => {
  return `${params.id} - ${params.namaSupplier}`;
};

const getOptions = () => {
  supplierStore.fetchSupplier().then(() => {
    options.value = supplierStore.data as ISupplier[];
  });
};

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
  await barangStore
    .createBarang(values)
    .then(() => {
      loader.hide();
      resetForm();
    })
    .catch((error) => {
      if (error instanceof Error) {
        setErrors({ stok: error.message });
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
