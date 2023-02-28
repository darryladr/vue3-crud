import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: () => {
        const isAuthenticated = localStorage.getItem('user');
        if (isAuthenticated) {
          return '/';
        } else {
          return '/login';
        }
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/dashboard/barang',
      name: 'barangDashboard',
      components: {
        default: () => import('@/views/BarangDashboardView.vue'),
        sidebar: () => import('@/layouts/SidebarLayout.vue'),
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/dashboard/supplier',
      name: 'supplierDashboard',
      components: {
        default: () => import('@/views/SupplierDashboardView.vue'),
        sidebar: () => import('@/layouts/SidebarLayout.vue'),
      },
      meta: {
        requiresAuth: true,
      },
    },

    // Auth
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('user');

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
