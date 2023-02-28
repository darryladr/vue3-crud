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
              v-if="serverParams.offset === supplierStore.totalPage!"
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
              v-if="serverParams.offset < supplierStore.totalPage!"
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
            :disabled="serverParams.offset === supplierStore.totalPage! ? true : false"
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
          of {{ supplierStore.totalRecord }} records
        </div>
      </div>
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
const firstRecord = ref(1);
const lastRecord = ref(20);
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

const nextPage = () => {
  if (serverParams.value.offset === supplierStore.totalPage) return;
  else {
    serverParams.value.offset += 1;
    firstRecord.value += serverParams.value.limit;
    lastRecord.value = Math.min(
      serverParams.value.offset * serverParams.value.limit,
      supplierStore.totalRecord!
    );
  }
  fetchSupplier();
};

const prevPage = () => {
  if (serverParams.value.offset === 1) return;
  else {
    serverParams.value.offset -= 1;

    firstRecord.value -= serverParams.value.limit;
    lastRecord.value = Math.min(
      serverParams.value.offset * serverParams.value.limit,
      supplierStore.totalRecord!
    );
  }
  fetchSupplier();
};

const goToPage = (page: number) => {
  serverParams.value.offset = page;
  firstRecord.value = (page - 1) * serverParams.value.limit + 1;
  lastRecord.value = Math.min(
    serverParams.value.offset * serverParams.value.limit,
    supplierStore.totalRecord!
  );
  fetchSupplier();
};

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
