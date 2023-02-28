<template>
  <div
    class="flex max-h-full w-full overflow-hidden rounded-md bg-white shadow-md"
  >
    <section class="container mx-auto flex max-h-full flex-col gap-4 p-6">
      <div class="flex h-10 items-center justify-between">
        <h2 class="text-lg font-semibold capitalize text-slate-700">
          List Supplier
        </h2>

        <div class="flex items-center gap-3">
          <button
            class="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600"
            @click="addModal.open()"
          >
            <VueIcon name="pr-plus" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div
        class="flex h-full flex-auto grow flex-col overflow-auto border border-slate-200 md:rounded-lg"
      >
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="sticky top-0 w-full bg-slate-50">
            <tr class="w-full">
              <th
                v-for="item in supplierHeader"
                :key="item.key"
                scope="col"
                class="py-3.5 px-4 text-left text-sm font-normal text-slate-500"
              >
                {{ item.name }}
              </th>
              <th
                scope="col"
                class="px-4 py-3.5 text-center text-sm font-normal text-slate-500"
                width="20%"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 overflow-auto bg-white">
            <tr v-for="item in computedSupplier" :key="item.id">
              <td
                v-for="(value, key) in item"
                :key="key"
                class="whitespace-nowrap p-4 text-sm font-medium text-slate-700"
              >
                <h2 class="font-normal text-slate-800">
                  {{ value === '' ? '-' : value }}
                </h2>
              </td>
              <td class="flex items-center justify-center gap-2 p-3">
                <button
                  class="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
                  @click="
                    () => {
                      itemTarget = item;
                      deleteModal.open();
                    }
                  "
                >
                  <VueIcon name="pr-plus" />
                  <span>Hapus</span>
                </button>
                <button
                  class="flex items-center justify-center rounded-lg bg-yellow-500 px-4 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-yellow-600"
                  @click="
                    () => {
                      itemTarget = item;
                      updateModal.open();
                    }
                  "
                >
                  <VueIcon name="pr-plus" />
                  <span>Update</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SupplierPagination />
    </section>
  </div>

  <ModalsContainer />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ModalsContainer, useModal } from 'vue-final-modal';

import type { ISupplier } from '@/common/data';
import { $loading } from '@/common/loading';
import { useSupplierStore } from '@/stores';

import AddSupplierModal from '../modals/AddSupplierModal.vue';
import ConfirmModal from '../modals/ConfirmModal.vue';
import DeleteModal from '../modals/DeleteModal.vue';
import UpdateSupplierModal from '../modals/UpdateSupplierModal.vue';
import SupplierPagination from './SupplierPagination.vue';

const supplierStore = useSupplierStore();
const supplierHeader = [
  { name: 'ID', key: 'id' },
  { name: 'Nama Supplier', key: 'namaSupplier' },
  { name: 'Alamat Supplier', key: 'alamatSupplier' },
  { name: 'No. Telp Supplier', key: 'noTelp' },
];
const supplier = ref<ISupplier[]>([]);

const itemTarget = ref({
  id: '',
  namaSupplier: '',
  alamat: '',
  noTelp: '',
});

const serverParams = ref({
  limit: 20,
  offset: 1,
});

const fetchSupplier = async () => {
  await supplierStore.fetchSupplier(serverParams.value).then(() => {
    supplier.value = supplierStore.data as ISupplier[];
  });
};

onMounted(async () => {
  await fetchSupplier();
});

const addModal = useModal({
  component: AddSupplierModal,
  attrs: {
    escToClose: false,
    onConfirm() {
      confirmAddModal.open();
    },
    onClosed() {
      fetchSupplier();
    },
  },
});

const confirmAddModal = useModal({
  component: ConfirmModal,
  attrs: {
    escToClose: false,
    title: 'Success',

    onConfirm() {
      confirmAddModal.close().then(() => {
        fetchSupplier();
      });
    },
  },
  slots: {
    default:
      'Data added successfully. You can add more data or close this modal.',
  },
});

const deleteItem = (id: string) => {
  const loader = $loading.show();
  supplierStore.deleteSupplier(id).then(() => {
    fetchSupplier();
    loader.hide();
  });
};

const deleteModal = useModal({
  component: DeleteModal,
  attrs: {
    escToClose: false,
    title: `Delete`,
    onOpened() {
      console.log(itemTarget.value.namaSupplier);
    },
    onConfirm() {
      deleteItem(itemTarget.value.id);
      deleteModal.close();
    },
  },
  slots: {
    default: `Are you sure you want to delete this data? This action cannot be undone.`,
  },
});

const updateItem = async (
  id: string,
  payload: Record<keyof ISupplier, any>
) => {
  const loader = $loading.show();
  await supplierStore.updateSupplier(id, payload).then(() => {
    fetchSupplier();
    loader.hide();
  });
};

const confirmUpdateModal = useModal({
  component: ConfirmModal,
  attrs: {
    escToClose: false,
    title: 'Success',

    onConfirm() {
      confirmUpdateModal.close().then(() => {
        fetchSupplier();
      });
    },
  },
  slots: {
    default: 'Data updated successfully.',
  },
});

const updateModal = useModal({
  component: UpdateSupplierModal,
  attrs: {
    escToClose: false,
    async onSubmit(values) {
      await updateItem(itemTarget.value.id, values).then(() => {
        updateModal.close();
        confirmUpdateModal.open();
      });
    },
    onClosed() {
      fetchSupplier();
    },
  },
});

const computedSupplier = computed(() => {
  return supplier.value.map((item) => {
    return {
      id: item.id ? item.id : '-',
      namaSupplier: item.namaSupplier ? item.namaSupplier : '-',
      alamat: item.alamat ? item.alamat : '-',
      noTelp: item.noTelp ? item.noTelp : '-',
    };
  });
});
</script>
