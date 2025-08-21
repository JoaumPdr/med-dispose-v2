<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-2xl font-bold mb-6">Meus Medicamentos</h1>
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
      if (med.quantidade <= 0) {
        medicamentos.value = medicamentos.value.filter(m => m.id !== id)
      }
    }
    quantidadesParaRemover.value[id] = ''
  } catch (error) {
    errorMessage.value = error.message || 'Erro ao remover medicamento.'
  }
}

onMounted(fetchMedicamentos)
</script>
