<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar 
      :isOpen="sidebarOpen" 
      @close="closeSidebar"
      @navigate="handleNavigation"
      page="dashboard"
    />
    <!-- Header -->
    <Header @toggleMenu="toggleSidebar" />

    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <!-- Botão de filtro no canto direito -->
        <button
          @click="showFilter = true"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-blue-50 transition"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.414a2 2 0 00-.293-1.172L2.293 6.707A1 1 0 012 6V4z"/>
          </svg>
          <span>Filtrar</span>
        </button>
      </div>

      <!-- Modal de filtro -->
      <div v-if="showFilter" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
          <h2 class="text-lg font-semibold mb-4">Filtrar por período</h2>
          <select
            v-model="filter"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mb-4"
          >
            <option disabled value="">Selecione o período</option>
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <div class="flex justify-end gap-2">
            <button @click="showFilter = false" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button @click="applyFilter" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Aplicar</button>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <ChartCard
          title="Medicamentos doados"
          :date="currentDate"
          :data="chartData.doados"
          color="bg-blue-500"
        />
        <ChartCard
          title="Medicamentos recebidos"
          :date="currentDate"
          :data="chartData.recebidos"
          color="bg-green-500"
        />
        <ChartCard
          title="Medicamentos reciclados"
          :date="currentDate"
          :data="chartData.reciclados"
          color="bg-purple-500"
        />
      </div>

      <!-- Contribuintes -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Contribuições</h2>
          <button class="text-blue-600 hover:text-blue-700 text-sm">Mostrar todos</button>
        </div>
        <div class="space-y-4">
          <div
            v-for="hospital in topHospitals"
            :key="hospital.id"
            class="flex items-center bg-white rounded-xl shadow p-4"
          >
            <img :src="hospital.image" alt="" class="w-12 h-12 rounded-full object-cover mr-4" />
            <div class="flex-1">
              <div class="font-semibold">{{ hospital.name }}</div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  :style="{ width: hospital.percent + '%' }"
                ></div>
              </div>
            </div>
            <span class="ml-4 text-sm text-gray-700">{{ hospital.value }} contribuições</span>
          </div>
        </div>
      </section>
    </div>
    <!-- Modal de adicionar remédio -->
    <AddMedicationModal :show="showAddMedication" @close="closeAddMedication" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import ChartCard from './ChartCard.vue'
import AddMedicationModal from './AddMedicationModal.vue'
import { useRouter } from 'vue-router'

const sidebarOpen = ref(false)
const showFilter = ref(false)
const filter = ref('')
const filterOptions = [
  { label: '1 Semana', value: 'week' },
  { label: '1 Mês', value: 'month' },
  { label: '3 Meses', value: '3months' },
  { label: '6 Meses', value: '6months' },
  { label: '1 Ano', value: 'year' }
]

const router = useRouter()
const showAddMedication = ref(false)

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

const handleNavigation = (page) => {
  switch (page) {
    case 'main-page':
      router.push('/main-page')
      break
    case 'dashboard':
      router.push('/dashboard-novo')
      break
    case 'add-medication':
      openAddMedication()
      break
    case 'hospitals':
      router.push('/hospitais')
      break
    case 'medications':
      router.push('/medicamentos')
      break
    default:
      break
  }
}

const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

const chartData = ref({
  doados: [],
  recebidos: [],
  reciclados: []
})
const topHospitals = ref([])

const fetchDashboardData = async () => {
  try {
    const statsRes = await fetch(`/api/medications/stats?period=${filter.value}`)
    const stats = await statsRes.json()
    chartData.value = {
      doados: stats.doado || [],
      recebidos: stats.recebido || [],
      reciclados: stats.reciclado || []
    }

    const hospRes = await fetch(`/api/hospitais/top-contribuintes?period=${filter.value}`)
    const hosp = await hospRes.json()
    topHospitals.value = hosp.data || []
  } catch (err) {
    console.error('Erro ao buscar dados do dashboard:', err)
  }
}

const applyFilter = () => {
  showFilter.value = false
  fetchDashboardData()
}

watch(filter, fetchDashboardData)
onMounted(fetchDashboardData)
</script>