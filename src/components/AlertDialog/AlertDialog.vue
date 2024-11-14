<script lang="ts" setup>
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

defineProps<{
  open: boolean;
  itemId: string;
  loading: boolean;
  title: string;
  description: string;
}>()
</script>

<template>
  <div>
    <AlertDialog :open="open">
      <AlertDialogContent class="max-w-80 rounded-3xl p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>{{ title }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ description }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div class="flex justify-between items-center gap-2">
            <AlertDialogCancel class="rounded-[24px] text-[#DA3468] bg-[#FFE2EB] m-0 w-full h-11" :disabled="loading"
              @click="$emit('cancel')">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction class="rounded-[24px] bg-[#F24F82] m-0 w-full h-11" :disabled="loading"
              @click="$emit('continue', itemId)">{{ loading ?
                'Excluindo...' :
                'Excluir' }}</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
