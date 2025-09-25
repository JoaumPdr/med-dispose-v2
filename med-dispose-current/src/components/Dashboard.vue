<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Sidebar -->
    <Sidebar
        :isOpen="sidebarOpen"
        @close="closeSidebar"
        @navigate="handleNavigation"
    />
    <!-- Header -->
    <Header @toggleMenu="toggleSidebar" />
    
    <!-- Main Content -->
    <main class="pt-20 px-4 pb-24 max-w-7xl mx-auto">
      <!-- Botão de voltar -->
      <div class="mb-6">
        <button
          @click="$router.go(-1)"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Voltar</span>
        </button>
      </div>
      
      <!-- Hero Section -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16"></div>
          <div class="relative">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Olá! Bem-vindo de volta</h1>
            <p class="text-gray-600 text-base md:text-lg">Gerencie seus medicamentos e encontre hospitais próximos</p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-2 md:p-3 rounded-full bg-amber-100 text-amber-600 mr-3 md:mr-4 flex-shrink-0">
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-600">Próximos ao Vencimento</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900">{{ expiringSoon }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Hospitals Section -->
      <div class="mb-8 md:mb-12">
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">Hospitais Próximos</h2>
          <button class="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base transition-colors">
            Ver todos
          </button>
        </div>
        <RecentHospitals />
      </div>

      <!-- Anúncios Recentes Section -->
      <div class="mb-8 md:mb-12">
        <AnunciosRecentes @ver-todos="verTodosAnuncios" @contatar-anunciante="contatarAnunciante" />
      </div>
    </main>

    <!-- Floating Action Button -->
    <FloatingActionButton @click="openAddMedication" />
    
    <!-- Add Medication Modal -->
    <AddMedicationModal :show="showAddMedication" :token="authToken" @close="closeAddMedication" @added="onMedicationAdded" />
    
    <!-- Anunciar Medicamento Modal -->
    <AnunciarMedicamentoModal :show="showAnunciarModal" @close="closeAnunciarModal" @medicamento-anunciado="onMedicamentoAnunciado" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import RecentHospitals from './RecentHospitals.vue'
import FloatingActionButton from './FloatingActionButton.vue'
import AddMedicationModal from './AddMedicationModal.vue'
import AnunciarMedicamentoModal from './AnunciarMedicamentoModal.vue'
import ExpiringMedications from './ExpiringMedications.vue'
import AnunciosRecentes from './AnunciosRecentes.vue'
import { useAuthStore } from '../stores/auth'
import { useAnunciosStore } from '../stores/anuncios'

const router = useRouter()
const sidebarOpen = ref(false)
const showAddMedication = ref(false)
const showAnunciarModal = ref(false)
const authStore = useAuthStore()
const anunciosStore = useAnunciosStore()
const authToken = computed(() => authStore.token || localStorage.getItem('token'))

// Mock data for stats
const totalMedications = ref(8)
const takenToday = ref(5)
const expiringSoon = ref(2)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const openAddMedication = () => {
  showAddMedication.value = true
}

const closeAddMedication = () => {
  showAddMedication.value = false
}

const openAnunciarModal = () => {
  showAnunciarModal.value = true
}

const closeAnunciarModal = () => {
  showAnunciarModal.value = false
}

const handleNavigation = (page) => {
  switch (page) {
    case 'dashboard':
      router.push('/dashboard-novo')
      break
    case 'add-medication':
      openAddMedication()
      break
    case 'anunciar-modal':
      openAnunciarModal()
      break
    case 'hospitals':
      // Adicionar navegação para hospitais quando a rota estiver disponível
      break
    case 'medications':
      router.push('/medicamentos')
      break
    case 'conversas':
      router.push('/conversas')
      break
    default:
      break
  }
  closeSidebar()
}

const onMedicationAdded = (med) => {
  // Optionally refresh medication lists or show a toast
  totalMedications.value++
}

const onMedicamentoAnunciado = (medicamento) => {
  // Adicionar o medicamento ao store de anúncios
  anunciosStore.adicionarAnuncio(medicamento)
  console.log('Medicamento anunciado:', medicamento)
}

const verTodosAnuncios = () => {
  // Navegar para página de todos os anúncios ou abrir modal
  router.push('/anunciar-medicamentos')
}

const contatarAnunciante = (anuncio) => {
  // Abrir chat ou modal de contato
  console.log('Contatar anunciante do medicamento:', anuncio.nome)
  // Aqui você pode implementar a lógica para abrir o chat
}
</script>