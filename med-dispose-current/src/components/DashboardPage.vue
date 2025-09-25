<template>
  <div class="min-h-screen bg-gray-100 font-sans antialiased">
    <!-- Header Fixo -->
    <header class="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="/favicon.ico" alt="MedDispose Logo" class="h-8 w-8" />
          <h1 class="text-2xl font-bold text-gray-900">MedDispose</h1>
        </div>
        <nav class="hidden md:flex space-x-8">
          <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Dashboard</a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Medicamentos</a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Anunciar</a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Conversas</a>
        </nav>
        <div class="flex items-center space-x-4">
          <button class="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h.01M12 6v6m0 0v6m0-6h6m-6 0H6m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <div class="relative">
            <img src="https://via.placeholder.com/40" alt="User Avatar" class="h-10 w-10 rounded-full cursor-pointer" />
            <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400"></span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Coluna Principal (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Seção de Visão Geral -->
          <section class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Visão Geral do Estoque</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
                <div class="p-2 bg-blue-200 rounded-full">
                  <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M12 10l-2 2-2-2"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total de Medicamentos</p>
                  <p class="text-xl font-bold text-gray-900">{{ medicamentos.length }}</p>
                </div>
              </div>
              <div class="bg-green-50 rounded-lg p-4 flex items-center space-x-3">
                <div class="p-2 bg-green-200 rounded-full">
                  <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Em Estoque</p>
                  <p class="text-xl font-bold text-gray-900">{{ totalEstoque }}</p>
                </div>
              </div>
              <div class="bg-red-50 rounded-lg p-4 flex items-center space-x-3">
                <div class="p-2 bg-red-200 rounded-full">
                  <svg class="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Retirados</p>
                  <p class="text-xl font-bold text-gray-900">{{ totalRetirados }}</p>
                </div>
              </div>
              <div class="bg-yellow-50 rounded-lg p-4 flex items-center space-x-3">
                <div class="p-2 bg-yellow-200 rounded-full">
                  <svg class="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Baixo Estoque</p>
                  <p class="text-xl font-bold text-gray-900">{{ medicamentosBaixoEstoque }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Gráfico de Análise -->
          <section class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">Análise de Uso de Medicamentos</h2>
              <div class="flex space-x-2">
                <button 
                  @click="changeChartType('bar')" 
                  :class="chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                  class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Barras
                </button>
                <button 
                  @click="changeChartType('line')" 
                  :class="chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                  class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Linha
                </button>
              </div>
            </div>
            <div class="h-80">
              <canvas id="medicamentosChart"></canvas>
            </div>
          </section>

          <!-- Tabela de Medicamentos Recentes -->
          <section class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Medicamentos em Destaque</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retirados (Mês)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="med in medicamentos.slice(0, 5)" :key="med.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ med.nome }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ med.quantidade }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ med.retirados || 0 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(med)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ getStatusText(med) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Coluna Lateral (1/3) -->
        <div class="lg:col-span-1 space-y-8">
          <!-- Seção de Notificações/Alertas -->
          <section class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Alertas e Notificações</h2>
            <ul class="space-y-4">
              <li class="flex items-start space-x-3">
                <div class="text-yellow-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-800 font-medium">Estoque baixo para Dipirona.</p>
                  <p class="text-sm text-gray-500">Apenas 10 unidades restantes. Faça um pedido!</p>
                </div>
              </li>
              <li class="flex items-start space-x-3">
                <div class="text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M12 10l-2 2-2-2"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-800 font-medium">Novo medicamento cadastrado.</p>
                  <p class="text-sm text-gray-500">Paracetamol 750mg adicionado ao estoque.</p>
                </div>
              </li>
            </ul>
          </section>

          <!-- Calendário de Validade -->
          <section class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Próximas Validades</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <button class="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <span class="font-semibold text-gray-800">Setembro 2025</span>
                <button class="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              <div class="grid grid-cols-7 gap-2 text-center text-sm">
                <div class="text-gray-500">Dom</div>
                <div class="text-gray-500">Seg</div>
                <div class="text-gray-500">Ter</div>
                <div class="text-gray-500">Qua</div>
                <div class="text-gray-500">Qui</div>
                <div class="text-gray-500">Sex</div>
                <div class="text-gray-500">Sáb</div>
                <!-- Dias do mês - Exemplo estático -->
                <div class="py-2"></div>
                <div class="py-2">1</div>
                <div class="py-2">2</div>
                <div class="py-2">3</div>
                <div class="py-2">4</div>
                <div class="py-2">5</div>
                <div class="py-2">6</div>
                <div class="py-2">7</div>
                <div class="py-2">8</div>
                <div class="py-2">9</div>
                <div class="py-2 bg-blue-100 rounded-md text-blue-800 font-medium">10</div>
                <div class="py-2">11</div>
                <div class="py-2">12</div>
                <div class="py-2">13</div>
                <div class="py-2">14</div>
                <div class="py-2">15</div>
                <div class="py-2">16</div>
                <div class="py-2">17</div>
                <div class="py-2">18</div>
                <div class="py-2">19</div>
                <div class="py-2">20</div>
                <div class="py-2">21</div>
                <div class="py-2">22</div>
                <div class="py-2">23</div>
                <div class="py-2">24</div>
                <div class="py-2">25</div>
                <div class="py-2">26</div>
                <div class="py-2">27</div>
                <div class="py-2">28</div>
                <div class="py-2">29</div>
                <div class="py-2">30</div>
              </div>
            </div>
          </section>

          <!-- Responsáveis Técnicos -->
          <section class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Responsáveis Técnicos</h2>
            <ul class="space-y-4">
              <li class="flex items-center space-x-4">
                <img src="https://via.placeholder.com/40" alt="Dr. Ana Silva" class="h-10 w-10 rounded-full" />
                <div>
                  <p class="font-medium text-gray-900">Dr. Ana Silva</p>
                  <p class="text-sm text-gray-500">Farmacêutica Chefe</p>
                </div>
              </li>
              <li class="flex items-center space-x-4">
                <img src="https://via.placeholder.com/40" alt="Dr. João Pereira" class="h-10 w-10 rounded-full" />
                <div>
                  <p class="font-medium text-gray-900">Dr. João Pereira</p>
                  <p class="text-sm text-gray-500">Gerente de Estoque</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const medicamentos = ref([])
const authStore = useAuthStore()
const chartType = ref('bar')
let medicamentosChart = null

const totalEstoque = computed(() => medicamentos.value.reduce((sum, med) => sum + med.quantidade, 0))
const totalRetirados = computed(() => medicamentos.value.reduce((sum, med) => sum + (med.retirados || 0), 0))
const medicamentosBaixoEstoque = computed(() => medicamentos.value.filter(med => med.quantidade < 20).length)

async function fetchMedicamentos() {
  try {
    const token = authStore.token
    if (!token) {
      console.error('Token não encontrado')
      return
    }

    const response = await fetch('http://localhost:3000/api/medications', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      medicamentos.value = data.data || []
    } else {
      console.error('Erro ao buscar medicamentos:', response.statusText)
      if (medicamentos.value.length === 0) {
        medicamentos.value = [
          { id: 1, nome: 'Dipirona', quantidade: 50, retirados: 10 },
          { id: 2, nome: 'Paracetamol', quantidade: 30, retirados: 5 },
          { id: 3, nome: 'Ibuprofeno', quantidade: 20, retirados: 2 },
          { id: 4, nome: 'Amoxicilina', quantidade: 15, retirados: 8 },
          { id: 5, nome: 'Omeprazol', quantidade: 25, retirados: 3 },
          { id: 6, nome: 'Losartana', quantidade: 8, retirados: 12 }
        ]
      }
    }
  } catch (error) {
    console.error('Erro ao conectar com a API:', error)
    if (medicamentos.value.length === 0) {
      medicamentos.value = [
        { id: 1, nome: 'Dipirona', quantidade: 50, retirados: 10 },
        { id: 2, nome: 'Paracetamol', quantidade: 30, retirados: 5 },
        { id: 3, nome: 'Ibuprofeno', quantidade: 20, retirados: 2 },
        { id: 4, nome: 'Amoxicilina', quantidade: 15, retirados: 8 },
        { id: 5, nome: 'Omeprazol', quantidade: 25, retirados: 3 },
        { id: 6, nome: 'Losartana', quantidade: 8, retirados: 12 }
      ]
    }
  }
}

function getStatusClass(medicamento) {
  const percentage = getUsagePercentage(medicamento)
  if (percentage > 70) return 'bg-red-100 text-red-800'
  if (percentage > 40) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

function getStatusText(medicamento) {
  const percentage = getUsagePercentage(medicamento)
  if (percentage > 70) return 'Crítico'
  if (percentage > 40) return 'Atenção'
  return 'Normal'
}

function getProgressBarClass(medicamento) {
  const percentage = getUsagePercentage(medicamento)
  if (percentage > 70) return 'bg-red-500'
  if (percentage > 40) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getUsagePercentage(medicamento) {
  const total = medicamento.quantidade + (medicamento.retirados || 0)
  return total > 0 ? Math.round(((medicamento.retirados || 0) / total) * 100) : 0
}

function renderChart() {
  const ctx = document.getElementById('medicamentosChart')
  if (!ctx) return

  if (medicamentosChart) {
    medicamentosChart.destroy()
  }

  const labels = medicamentos.value.map(m => m.nome)
  const estoqueData = medicamentos.value.map(m => m.quantidade)
  const retiradosData = medicamentos.value.map(m => m.retirados || 0)

  // Criar cores dinâmicas para medicamentos com estoque zero
  const estoqueColors = medicamentos.value.map(m => 
    m.quantidade === 0 ? '#fca5a5' : '#4299e1' // Vermelho claro para estoque zero
  )
  const estoqueBorderColors = medicamentos.value.map(m => 
    m.quantidade === 0 ? '#ef4444' : '#2b6cb0' // Vermelho para borda quando estoque zero
  )

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Estoque Atual',
        backgroundColor: estoqueColors,
        borderColor: estoqueBorderColors,
        data: estoqueData,
        borderRadius: 4,
      },
      {
        label: 'Medicamentos Retirados',
        backgroundColor: '#fc8181',
        borderColor: '#e53e3e',
        data: retiradosData,
        borderRadius: 4,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false
        }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          color: '#e2e8f0'
        }
      }
    }
  }

  if (chartType.value === 'bar') {
    medicamentosChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    })
  } else if (chartType.value === 'line') {
    // Criar cores de pontos dinâmicas para medicamentos com estoque zero
    const pontoColors = medicamentos.value.map(m => 
      m.quantidade === 0 ? '#ef4444' : '#4299e1'
    )
    
    medicamentosChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Estoque Atual',
            borderColor: '#4299e1',
            backgroundColor: 'rgba(66, 153, 225, 0.2)',
            data: estoqueData,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: pontoColors,
            pointBorderColor: pontoColors,
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Medicamentos Retirados',
            borderColor: '#fc8181',
            backgroundColor: 'rgba(252, 129, 129, 0.2)',
            data: retiradosData,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: options
    })
  }
}

function changeChartType(type) {
  chartType.value = type
  renderChart()
}

onMounted(async () => {
  await fetchMedicamentos()
  await nextTick()
  renderChart()
})
</script>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>