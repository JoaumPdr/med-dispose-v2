import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'choice',
      component: () => import('../components/ChoicePage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LoginPage.vue')
    },
    {
      path: '/cadastro-hospital',
      name: 'cadastro-hospital',
      component: () => import('../components/CadastroHospital.vue')
    },
    {
      path: '/main-page',
      name: 'pagina-principal',
      component: () => import('../components/MainPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard-novo',
      name: 'dashboard',
      component: () => import('../components/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mapa',
      name: 'mapa',
      component: () => import('../components/MapPage.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
  await authStore.loginHospital(email.value, password.value);
  router.push('/main-page'); // Redireciona para a MainPage após login
  await authStore.login(email.value, password.value);
  router.push('/main-page'); // Redireciona para a MainPage após login
})

export default router
