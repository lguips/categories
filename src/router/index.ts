import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../modules/home/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        pageName: 'Categorias',
      },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../modules/categories/views/CategoriesView.vue'),
      meta: {
        pageName: 'Categorias',
      },
    },
    {
      path: '/subcategories',
      name: 'subcategories',
      meta: {
        pageName: 'Subcategorias',
      },
      component: () => import('../modules/subcategories/views/SubcategoriesView.vue'),
    },
  ],
})

export default router
