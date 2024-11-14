<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Cross2Icon, CheckIcon, ReloadIcon } from '@radix-icons/vue';
import { ref } from 'vue';

defineProps<{
  loading: boolean;
}>()

const emit = defineEmits<{
  (e: 'confirm', categoryName: string): void
}>()

const onRegisterMode = ref<boolean>(false);
const categoryName = ref<string>('');

function enableRegisterMode() {
  onRegisterMode.value = true;
}

function onCancelRegisterMode() {
  onRegisterMode.value = false;
  categoryName.value = '';
}

function onConfirm() {
  emit('confirm', categoryName.value);
  categoryName.value = '';
  onRegisterMode.value = false;
}
</script>

<template>
  <div>
    <div data-testid="input-container" v-if="onRegisterMode" class="mb-3 relative w-full max-w-full">
      <input data-testid="input-value" :disabled="loading" v-model="categoryName" type="text"
        placeholder="Crie uma subcategoria..."
        class="w-full h-[56px] p-4 rounded-[14px] outline-[#008197] border border-solid border-[#008197]">

      <Button data-testid="on-cancel-register-button" :disabled="loading" @click="onCancelRegisterMode" size="icon"
        class="bg-[#FFE2EB] rounded-full top-[8px] right-[52px] absolute">
        <Cross2Icon class="w-4 h-4 text-[#DA3468]" />
      </Button>

      <Button data-testid="on-confirm-event-button" @click="onConfirm" :disabled="loading" size="icon"
        class="bg-[#F24F82] text-[#FFFFFF] rounded-full top-[8px] right-[8px] absolute">
        <ReloadIcon v-if="loading" class="w-4 h-4 animate-spin" />
        <CheckIcon v-else class="w-4 h-4" />
      </Button>
    </div>

    <div data-testid="on-enable-register-mode" v-else @click="enableRegisterMode"
      class="flex items-center justify-between mb-3 rounded-[14px] item p-4 bg-[#F3F3F5]">
      <span data-testid="button-text" class="text-[#DA3468] font-medium text-base">Adicionar Subcategoria</span>
      <span data-testid="button-icon" class="text-[#DA3468]">+</span>
    </div>
  </div>
</template>
