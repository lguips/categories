<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-icons/vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { type ICategory } from '@/modules/shared/types/ICategory';
import { apiOptions, BASE_URL } from '@/config/api';
import axios from 'axios';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ChevronRightIcon } from '@radix-icons/vue';
import { showErrorToast } from '@/helpers/toast';
import HomeSkeletonLoader from '../components/HomeSkeletonLoader/HomeSkeletonLoader.vue';

const categories = ref<ICategory[]>([]);
const loading = ref<boolean>(true);
const router = useRouter();
const onError = ref<boolean>(false);

async function getCategories() {
  try {
    onError.value = false;
    loading.value = true;
    const response = await axios.get(`${BASE_URL}/categories`,
      apiOptions
    );
    categories.value = response.data;
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
    onError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  getCategories();
});
</script>

<template>
  <div class="py-0 px-4">
    <h1 class="mb-1 font-semibold text-xl text-[#31436F]">Organize seu catálogo com categorias e subcategorias</h1>
    <h2 class="mb-6 font-medium text-base text-[#586893]">Ao usar categorias e subcategorias do catálogo, você ajuda
      seus
      clientes a
      encontrarem
      os produtos
      desejados.
    </h2>

    <Button data-testid="create-categories-button" v-if="!loading && categories.length === 0 && !onError"
      class="rounded-3xl	 bg-[#FFE2EB] text-[#DA3468]" @click="router.push('categories')">
      Criar categorias
      <PlusIcon class="w-4 h-4" />
    </Button>

    <div v-if="onError">Houve um erro ao carregar os dados</div>

    <HomeSkeletonLoader v-if="loading" />

    <div v-if="categories.length">
      <Card @click="router.push('categories')" class="mb-3 cursor-pointer">
        <CardContent class="flex items-center p-4 justify-between h-14">
          <div class="flex items-center">
            <p class="text-[#29354F] text-base font-medium">Categorias</p>
            <p
              class="ml-4 rounded-[16px] text-lg font-medium text-[#586893] bg-[#DDE2EF] w-[40px] h-[28px] flex items-center justify-center">
              {{ categories.length }}
            </p>
          </div>
          <ChevronRightIcon class="w-4 h-4" />
        </CardContent>
      </Card>

      <Card @click="router.push('subcategories')" class="cursor-pointer h-[56px]">
        <CardContent class="flex items-center p-4 justify-between h-14">
          <div class="flex items-center">
            <p class="text-[#29354F] text-base font-medium">Subcategorias</p>
          </div>
          <ChevronRightIcon class="w-4 h-4" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
