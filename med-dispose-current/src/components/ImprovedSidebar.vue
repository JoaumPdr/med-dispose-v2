<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <div
    :class="`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">Med Dispose</h2>
          <p class="text-blue-100 text-sm">Sistema de Gestão</p>
        </div>
      </div>

      <button
        @click="closeSidebar"
        class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- User Info -->
    <div class="p-6 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-lg">{{ userInitials }}</span>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-900">{{ userName }}</p>
          <p class="text-sm text-gray-500">{{ userEmail }}</p>
          <div class="flex items-center mt-1">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span class="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="flex-1 overflow-y-auto p-6">
      <nav class="space-y-2">
        <!-- Dashboard -->
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Principal</h3>
          <button
            @click="goToDashboard"
            :class="[
              'w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group',
              currentRoute === 'dashboard' 
                ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                : 'hover:bg-blue-50 hover:shadow-sm'
            ]"
          >
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
              currentRoute === 'dashboard' 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
            ]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="text-left flex-1">
              <h4 class="font-semibold text-gray-900">Dashboard</h4>
              <p class="text-sm text-gray-500">Visão geral do sistema</p>
            </div>
            <div v-if="currentRoute === 'dashboard'" class="w-2 h-2 bg-blue-500 rounded-full"></div>
          </button>
        </div>

        <!-- Medicamentos -->
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Medicamentos</h3>
          <div class="space-y-2">
            <button
              @click="goToMedicamentos"
              :class="[
                'w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group',
                currentRoute === 'medications' 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'hover:bg-green-50 hover:shadow-sm'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                currentRoute === 'medications' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-600 group-hover:bg-green-200'
              ]">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.22 11.29l6.59-6.59C11.42 4.08 12.2 3.75 13 3.75s1.58.33 2.19.95L20.78 10.29c1.28 1.28 1.28 3.36 0 4.64L14.19 21.52c-.61.61-1.39.95-2.19.95s-1.58-.33-2.19-.95L3.22 15.93c-1.28-1.28-1.28-3.36 0-4.64z"/>
                </svg>
              </div>
              <div class="text-left flex-1">
                <h4 class="font-semibold text-gray-900">Medicamentos</h4>
                <p class="text-sm text-gray-500">Gerenciar estoque</p>
              </div>
              <div v-if="currentRoute === 'medications'" class="w-2 h-2 bg-green-500 rounded-full"></div>
            </button>

            <button
              @click="navigateTo('add-medication')"
              class="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group ml-4"
            >
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <div class="text-left flex-1">
                <h4 class="font-medium text-gray-900 text-sm">Adicionar</h4>
                <p class="text-xs text-gray-500">Novo medicamento</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Comunicação -->
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Comunicação</h3>
          <div class="space-y-2">
            <button
              @click="goToConversas"
              :class="[
                'w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group',
                currentRoute === 'conversas' 
                  ? 'bg-purple-50 border-2 border-purple-200 shadow-sm' 
                  : 'hover:bg-purple-50 hover:shadow-sm'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative',
                currentRoute === 'conversas' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
              ]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span class="text-xs text-white font-bold">3</span>
                </div>
              </div>
              <div class="text-left flex-1">
                <h4 class="font-semibold text-gray-900">Conversas</h4>
                <p class="text-sm text-gray-500">Chat com hospitais</p>
              </div>
              <div v-if="currentRoute === 'conversas'" class="w-2 h-2 bg-purple-500 rounded-full"></div>
            </button>

            <button
              @click="goToMapa"
              :class="[
                'w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group',
                currentRoute === 'mapa' 
                  ? 'bg-orange-50 border-2 border-orange-200 shadow-sm' 
                  : 'hover:bg-orange-50 hover:shadow-sm'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                currentRoute === 'mapa' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
              ]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="text-left flex-1">
                <h4 class="font-semibold text-gray-900">Mapa</h4>
                <p class="text-sm text-gray-500">Localizar farmácias</p>
              </div>
              <div v-if="currentRoute === 'mapa'" class="w-2 h-2 bg-orange-500 rounded-full"></div>
            </button>
          </div>
        </div>

        <!-- Administração -->
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Administração</h3>
          <button
            @click="navigateTo('hospitals')"
            class="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
          >
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="text-left flex-1">
              <h4 class="font-semibold text-gray-900">Hospitais</h4>
              <p class="text-sm text-gray-500">Gerenciar hospitais</p>
            </div>
          </button>
        </div>
      </nav>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-200 p-6 bg-gray-50">
      <div class="space-y-3">
        <!-- Configurações -->
        <button class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-sm font-medium text-gray-700">Configurações</span>
        </button>

        <!-- Logout -->
        <button 
          @click="logout"
          class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="text-sm font-medium">Sair</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'navigate'])
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const currentRoute = computed(() => {
  const routeName = route.name
  if (routeName === 'dashboard') return 'dashboard'
  if (routeName === 'medications') return 'medications'
  if (routeName === 'conversas') return 'conversas'
  if (routeName === 'mapa') return 'mapa'
  return ''
})

const userName = computed(() => authStore.user?.nome || 'Usuário')
const userEmail = computed(() => authStore.user?.email || 'usuario@medical.com')
const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
})

const closeSidebar = () => {
  emit('close')
}

const navigateTo = (page) => {
  emit('navigate', page)
  closeSidebar()
}

const goToDashboard = () => {
  emit('navigate', 'dashboard')
  closeSidebar()
}

const goToMedicamentos = () => {
  emit('navigate', 'medications')
  closeSidebar()
}

const goToConversas = () => {
  emit('navigate', 'conversas')
  closeSidebar()
}

const goToMapa = () => {
  emit('navigate', 'mapa')
  closeSidebar()
}

const logout = () => {
  if (confirm('Tem certeza que deseja sair?')) {
    authStore.logout()
    router.push('/login')
    closeSidebar()
  }
}
</script>

<style scoped>
/* Scrollbar personalizada */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

