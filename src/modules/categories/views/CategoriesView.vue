<script lang="ts" setup>
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ReloadIcon } from '@radix-icons/vue';
import { type ICategory } from '@/modules/shared/types/ICategory';
import { apiOptions, BASE_URL } from '@/config/api';
import { showErrorToast, showSuccessToast } from '@/helpers/toast';
import EmptyCategoriesMessage from '../components/EmptyCategoriesMessage/EmptyCategoriesMessage.vue';
import CategoryItem from '../components/CategoryItem/CategoryItem.vue';
import CategoriesSkeletonLoader from '../components/CategoriesSkeletonLoader/CategoriesSkeletonLoader.vue';
import AlertDialog from '@/components/AlertDialog/AlertDialog.vue';


const input = ref<string>('');
const categories = ref<ICategory[]>([]);
const loading = ref<boolean>(false);
const open = ref<boolean>(false);
const currentCategoryId = ref<string>('');

async function getCategories() {
  try {
    loading.value = true;
    const response = await axios.get(`${BASE_URL}/categories`,
      apiOptions
    );
    categories.value = response.data;
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    loading.value = false;
  }
}


async function createCategory(name: string) {
  try {
    loading.value = true;
    const response = await axios.post(`${BASE_URL}/categories`, {
      name,
    }, apiOptions);
    input.value = '';
    showSuccessToast(`Categoria ${name} adicionada com sucesso.`);
    categories.value.push(response.data);
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    loading.value = false;
  }
}

async function deleteCategory(categoryId: string) {
  try {
    loading.value = true;
    await axios.delete(`${BASE_URL}/categories/${categoryId}?forceDeleteTree=true`,
      apiOptions
    );
    categories.value = categories.value.filter(category => category.id != categoryId);
    showSuccessToast('Categoria excluída com sucesso.');
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    loading.value = false;
    closeDialog();
  }
}

function openDialog(categoryId: string) {
  open.value = true;
  currentCategoryId.value = categoryId;
}

function closeDialog() {
  open.value = false;
}

async function updateCategory(id: string, name: string) {
  try {
    loading.value = true;
    const response = await axios.patch(`${BASE_URL}/categories/${id}`, {
      name,
    }, apiOptions);
    showSuccessToast('Categoria alterada com sucesso.');
    const updatedCategories = categories.value.map(category => {
      if (category.id === id) {
        category = response.data;
      }
      return category;
    });

    categories.value = updatedCategories;
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  getCategories();
});
</script>

<template>
  <div class="px-4">
    <div class="flex items-center mb-4">
      <Input v-model="input" class="mr-2 rounded-3xl h-11 grow-1" placeholder="Crie uma categoria..." />
      <Button :disabled="!input.length || loading" @click="createCategory(input)"
        class="rounded-3xl disabled:opacity-75 disabled:bg-[#DDE2EF] disabled:text-[#8693B4] h-11 w-20 bg-[#F24F82]">
        <ReloadIcon v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
        <span v-if="!loading">Criar</span>
      </Button>
    </div>

    <CategoriesSkeletonLoader v-if="loading" />

    <EmptyCategoriesMessage v-if="!loading && categories.length === 0" />
    <div v-if="categories.length > 0 && !loading">
      <CategoryItem :loading="loading" @update-category="updateCategory" @open-dialog="openDialog"
        v-for="category in categories" :key="category.id" :category="category" />
    </div>
    <AlertDialog title="Deseja excluir a categoria?" description="Essa ação é irreversível e implica na exclusão das subcategorias vinculadas.
            Os produtos ligados a essa categoria não serão excluidos." :open="open" :itemId="currentCategoryId"
      :loading="loading" @cancel="closeDialog" @continue="deleteCategory(currentCategoryId)" />
  </div>
</template>
