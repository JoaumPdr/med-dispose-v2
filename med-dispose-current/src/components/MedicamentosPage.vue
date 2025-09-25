<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header com botão de voltar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Voltar</span>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Meus Medicamentos</h1>
      </div>
    </div>
    <div v-if="loading" class="text-center py-8">Carregando...</div>
    <div v-else>
      <div v-if="errorMessage" class="text-red-600 text-center mb-4">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-green-600 text-center mb-4">{{ successMessage }}</div>
      <div v-if="medicamentos.length === 0" class="text-gray-500 text-center">Nenhum medicamento cadastrado.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="med in medicamentos" :key="med.id" class="bg-white rounded-xl shadow p-6 flex flex-col">
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ med.nome }}</h2>
            <p class="text-sm text-gray-600 mb-1">Quantidade: {{ med.quantidade }}</p>
            <p class="text-sm text-gray-600 mb-1">Validade: {{ med.validade || med.dataVencimento }}</p>
            <p class="text-sm text-gray-600 mb-1">Categoria: {{ med.categoria || med.fabricante }}</p>
            <p class="text-sm text-gray-600 mb-1">Estado: {{ med.estado_conservacao || 'bom' }}</p>
          </div>
          <div class="flex items-center mt-4 space-x-2">
            <input type="number" min="1" :max="med.quantidade" v-model.number="quantidadesParaRemover[med.id]" class="w-20 border rounded px-2 py-1" placeholder="Qtd" />
            <button @click="removerMedicamento(med.id, quantidadesParaRemover[med.id] || 1)" class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition">Remover</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'


const medicamentos = ref([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const quantidadesParaRemover = ref({})
const authStore = useAuthStore()

const fetchMedicamentos = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await fetch('http://localhost:3000/api/medications', {
      headers: {
        'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.message)
    medicamentos.value = data.data
  } catch (error) {
    errorMessage.value = error.message || 'Erro ao buscar medicamentos.'
  } finally {
    loading.value = false
  }
}


const removerMedicamento = async (id, quantidade) => {
  errorMessage.value = ''
  successMessage.value = ''
  if (!quantidade || quantidade < 1) {
    errorMessage.value = 'Informe uma quantidade válida.'
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/medications/${id}/remover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}`
      },
      body: JSON.stringify({ quantidade })
    })
    const data = await response.json()
    if (!data.success) throw new Error(data.message)
    successMessage.value = 'Medicamento removido com sucesso!'
    // Atualiza a quantidade localmente
    const med = medicamentos.value.find(m => m.id === id)
    if (med) {
      med.quantidade -= quantidade
      // Não remove o medicamento da lista mesmo se a quantidade for zero
      // Isso mantém o medicamento visível no gráfico
      if (med.quantidade < 0) {
        med.quantidade = 0
      }
    }
    quantidadesParaRemover.value[id] = ''
  } catch (error) {
    errorMessage.value = error.message || 'Erro ao remover medicamento.'
  }
}

onMounted(fetchMedicamentos)
</script>
