<template>
  <!-- Overlay -->
  <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
      @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <div
      :class="`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900">Medical App</h2>
      </div>

      <button
          @click="closeSidebar"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Menu Items -->
    <div class="p-6">
      <nav class="space-y-4">
        <!-- Dashboard -->
        <button
            @click="goToDashboard"
            class="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-900">Dashboard</h3>
            <p class="text-sm text-gray-500">Visão geral do sistema</p>
          </div>
        </button>

        <!-- Adicionar Remédios -->
        <button
            @click="navigateTo('add-medication')"
            class="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-green-50 transition-colors group"
        >
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-900">Adicionar Remédios</h3>
            <p class="text-sm text-gray-500">Cadastrar novos medicamentos</p>
          </div>
        </button>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- Additional Menu Items -->
        <button
            @click="navigateTo('anunciar-modal')"
            class="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-orange-50 transition-colors group"
        >
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-900">Anunciar Medicamentos</h3>
            <p class="text-sm text-gray-500">Publicar medicamentos disponíveis</p>
          </div>
        </button>

        <button
            @click="goToMedicamentos"
            class="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.22 11.29l6.59-6.59C11.42 4.08 12.2 3.75 13 3.75s1.58.33 2.19.95L20.78 10.29c1.28 1.28 1.28 3.36 0 4.64L14.19 21.52c-.61.61-1.39.95-2.19.95s-1.58-.33-2.19-.95L3.22 15.93c-1.28-1.28-1.28-3.36 0-4.64z"/>
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-900">Medicamentos</h3>
            <p class="text-sm text-gray-500">Gerenciar estoque</p>
          </div>
        </button>

        <button
            @click="goToConversas"
            class="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-purple-50 transition-colors group"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a4 4 0 00-8 0v2m8 0H7" />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-900">Conversas</h3>
            <p class="text-sm text-gray-500">Chat com hospitais</p>
          </div>
        </button>
      </nav>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span class="text-gray-600 font-semibold">U</span>
        </div>
        <div>
          <p class="font-semibold text-gray-900">Usuário</p>
          <p class="text-sm text-gray-500">usuario@medical.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'navigate'])

const closeSidebar = () => {
  emit('close')
}


import { useRouter } from 'vue-router'
const router = useRouter()

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
</script>