import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateFormView.vue'),
    },
    {
      path: '/form/:id',
      name: 'form-view',
      component: () => import('../views/FormDetailView.vue'),
    },
  ],
})

export default router
