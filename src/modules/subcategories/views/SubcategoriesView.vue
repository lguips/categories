<script lang="ts" setup>
import { type ICategory } from '@/modules/shared/types/ICategory';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { apiOptions, BASE_URL } from '@/config/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ReloadIcon } from '@radix-icons/vue';
import { showErrorToast, showSuccessToast } from '@/helpers/toast';
import CategoryItem from '@/modules/categories/components/CategoryItem/CategoryItem.vue';
import AddSubcategoryItem from '../components/AddSubcategoryItem.vue/AddSubcategoryItem.vue';
import SubcategorySkeletonLoader from '../components/SubcategorySkeletonLoader/SubcategorySkeletonLoader.vue';
import AlertDialog from '@/components/AlertDialog/AlertDialog.vue';


const categories = ref<ICategory[]>([]);
const subcategories = ref<ICategory[]>([]);
const loading = ref<boolean>(false);
const subcategoryLoading = ref<boolean>(true);
const currentParentCategoryId = ref<string | string[] | undefined>('');
const currentCategoryId = ref<string>('');
const open = ref<boolean>(false);

async function getCurrentParentSubcategories(parentCategoryId: string) {
  try {
    subcategories.value = [];
    subcategoryLoading.value = true;
    const response = await axios.get(`${BASE_URL}/categories?parentCategoryId=${parentCategoryId}`,
      apiOptions
    );
    subcategories.value = response.data
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    subcategoryLoading.value = false;
  }
}

async function getParentCategories() {
  try {
    loading.value = true;
    const response = await axios.get(`${BASE_URL}/categories`,
      apiOptions
    );
    categories.value = response.data;
    currentParentCategoryId.value = categories.value[0].id;
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    loading.value = false;
  }
}

async function createSubcategory(name: string) {
  try {
    subcategoryLoading.value = true;
    const response = await axios.post(`${BASE_URL}/categories`, {
      name,
      parent: {
        id: currentParentCategoryId.value
      }
    }, apiOptions);
    showSuccessToast(`Subcategoria ${name} adicionada com sucesso.`);
    subcategories.value.push(response.data);
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    subcategoryLoading.value = false;
  }
}

async function updateCategory(id: string, name: string) {
  try {
    subcategoryLoading.value = true;
    const response = await axios.patch(`${BASE_URL}/categories/${id}`, {
      name,
    }, apiOptions);
    showSuccessToast('Subcategoria alterada com sucesso.');
    const updatedSubcategories = subcategories.value.map(subcategory => {
      if (subcategory.id === id) {
        subcategory = response.data;
      }
      return subcategory;
    });
    subcategories.value = updatedSubcategories;
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    subcategoryLoading.value = false;
  }
}

async function deleteCategory(categoryId: string) {
  try {
    subcategoryLoading.value = true;
    await axios.delete(`${BASE_URL}/categories/${categoryId}?forceDeleteTree=true`,
      apiOptions
    );
    subcategories.value = subcategories.value.filter(category => category.id != categoryId);
    showSuccessToast('Subcategoria excluída com sucesso.');
  } catch (error: unknown) {
    showErrorToast(error.response.data.message);
  } finally {
    subcategoryLoading.value = false;
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

function getCurrentParentCategoryId(event: string | string[] | undefined) {
  currentParentCategoryId.value = event;
}

watch(currentParentCategoryId, parentCategoryId => {
  if (parentCategoryId) getCurrentParentSubcategories(parentCategoryId as string);
})

onMounted(async () => {
  getParentCategories();
});
</script>

<template>
  <div class="px-4">
    <h1 class="text-[#737F9C] text-sm text-center font-medium mb-4">Adicione as subcategorias embaixo das categorias pai
    </h1>
    <SubcategorySkeletonLoader v-if="loading" />
    <Accordion @update:model-value="getCurrentParentCategoryId($event)" v-if="categories.length" type="single"
      class="w-full" collapsible :default-value="currentParentCategoryId">
      <AccordionItem class="border mb-3 rounded-2xl px-4" v-for="category in categories" :key="category.id"
        :value="category.id">
        <AccordionTrigger>{{ category.name }}</AccordionTrigger>
        <AccordionContent>

          <div v-if="subcategoryLoading" class="mt-4 mb-6 flex justify-center items-center">
            <ReloadIcon class="w-4 h-4 animate-spin" />
          </div>

          <div v-if="categories.length > 0 && !subcategoryLoading">
            <CategoryItem v-for="subcategory in subcategories" :key="subcategory.id" :loading="subcategoryLoading"
              @update-category="updateCategory" @open-dialog="openDialog" :category="subcategory" />
          </div>

          <AddSubcategoryItem @confirm="createSubcategory" :category-id="category.id" :loading="subcategoryLoading" />

        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <AlertDialog title="Deseja excluir a subcategoria?"
      description="essa ação é irreversível. Lembre-se os produtos ligados a essa categoria não serão excluidos."
      :open="open" :itemId="currentCategoryId" :loading="subcategoryLoading" @cancel="closeDialog"
      @continue="deleteCategory(currentCategoryId)" />
  </div>
</template>

<style></style>
