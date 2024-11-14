<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ArrowLeftIcon } from '@radix-icons/vue'
import { useRouter, useRoute } from 'vue-router';
import { Toaster } from '@/components/ui/toast';
const router = useRouter();
const route = useRoute();
</script>

<template>
  <header class="mb-4 border border-solid border-[#F3F3F5] py-5 px-4">
    <nav class="flex items-center">
      <div class="flex-none w-14">
        <ArrowLeftIcon v-if="route.name !== 'home'" @click="router.go(-1)" class="w-5 h-5 text-[#DA3468] flex-none" />
      </div>
      <div class="grow">
        <h1 class="flex-auto text-center text-lg font-medium">{{
          route.name === 'subcategories' ? 'Subcategorias' : 'Categorias'
          }}</h1>
      </div>
      <div class="flex-none w-14">
      </div>
    </nav>
  </header>

  <RouterView />
  <Toaster />
</template>
