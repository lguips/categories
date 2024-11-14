<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { TrashIcon, Pencil1Icon, DotsHorizontalIcon, Cross2Icon, CheckIcon, ReloadIcon } from '@radix-icons/vue';
import { type ICategory } from '@/modules/shared/types/ICategory';
import { ref } from 'vue';

const onEditMode = ref<boolean>(false);
const editContent = ref<string>('');

defineProps<{
  category: ICategory;
  loading: boolean;
}>()

const emit = defineEmits<{
  (e: 'open-dialog', categoryId: string): void
  (e: 'update-category', categoryId: string, editContent: string): void
}>()

function enableEditMode(categoryName: string) {
  editContent.value = categoryName;
  onEditMode.value = true;
}

function cancelEditMode() {
  onEditMode.value = false;
  editContent.value = '';
}

function openDialog(categoryId: string) {
  emit('open-dialog', categoryId);
}

function updateCategory(categoryId: string, editContent: string) {
  emit('update-category', categoryId, editContent)
}
</script>

<template>
  <div>
    <div data-testid="edit-input" v-if="onEditMode" class="mb-3 relative w-full max-w-full">
      <input data-testid="edit-input-value" :disabled="loading" v-model="editContent" type="text"
        class="w-full h-[56px] p-4 rounded-[14px] outline-[#008197] border border-solid border-[#008197]">

      <Button data-testid="cancel-edit" :disabled="loading" @click="cancelEditMode" size="icon"
        class="bg-[#FFE2EB] rounded-full top-[8px] right-[52px] absolute">
        <Cross2Icon class="w-4 h-4 text-[#DA3468]" />
      </Button>

      <Button data-testid="trigger-emit-update-category" :disabled="loading"
        @click="updateCategory(category.id, editContent)" size="icon"
        class="bg-[#F24F82] text-[#FFFFFF] rounded-full top-[8px] right-[8px] absolute">
        <ReloadIcon v-if="loading" class="w-4 h-4 animate-spin" />
        <CheckIcon v-else class="w-4 h-4" />
      </Button>
    </div>

    <div data-testid="dropdown-menu" v-else
      class="flex items-center justify-between mb-3 rounded-[14px] item p-4 bg-[#F3F3F5]">
      <span class="font-medium text-base">{{ category.name }}</span>
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-menu-trigger">
          <DotsHorizontalIcon class="w-4 h-4 text-[#F24F82]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>

          <DropdownMenuItem data-testid="dropdown-menu-rename" @click="enableEditMode(category.name)">
            <Pencil1Icon class="w-4 h-4 text-[#F24F82]" />
            Renomear
          </DropdownMenuItem>

          <DropdownMenuItem data-testid="dropdown-menu-remove" @click="openDialog(category.id)">
            <TrashIcon class="w-4 h-4 text-[#F24F82]" /> Excluir
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
