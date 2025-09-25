<template>
  <!-- Modal Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Anunciar Medicamento</h2>
        <button
          @click="closeModal"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <form @submit.prevent="anunciarMedicamento" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nome do Medicamento -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Medicamento</label>
              <input
                v-model="formulario.nome"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Dipirona 500mg"
              />
            </div>

            <!-- Quantidade -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quantidade Disponível</label>
              <input
                v-model.number="formulario.quantidade"
                type="number"
                min="1"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 100"
              />
            </div>

            <!-- Data de Validade -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Data de Validade</label>
              <input
                v-model="formulario.validade"
                type="date"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <!-- Preço -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preço por Unidade (R$)</label>
              <input
                v-model.number="formulario.preco"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 2.50"
              />
            </div>

            <!-- Categoria -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                v-model="formulario.categoria"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                <option value="analgesico">Analgésico</option>
                <option value="antibiotico">Antibiótico</option>
                <option value="anti-inflamatorio">Anti-inflamatório</option>
                <option value="cardiovascular">Cardiovascular</option>
                <option value="diabetes">Diabetes</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <!-- Estado de Conservação -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado de Conservação</label>
              <select
                v-model="formulario.estado"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione o estado</option>
                <option value="excelente">Excelente</option>
                <option value="bom">Bom</option>
                <option value="regular">Regular</option>
              </select>
            </div>
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição Adicional</label>
            <textarea
              v-model="formulario.descricao"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Informações adicionais sobre o medicamento..."
            ></textarea>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Publicando...</span>
              <span v-else>Publicar Anúncio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Mensagem de feedback -->
  <div v-if="mensagem" class="fixed bottom-4 right-4 z-60">
    <div
      :class="[
        'px-6 py-4 rounded-lg shadow-lg',
        mensagem.tipo === 'sucesso' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      {{ mensagem.texto }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'medicamento-anunciado'])

const loading = ref(false)
const mensagem = ref(null)

const formulario = ref({
  nome: '',
  quantidade: null,
  validade: '',
  preco: null,
  categoria: '',
  estado: '',
  descricao: ''
})

const closeModal = () => {
  emit('close')
  limparFormulario()
}

const anunciarMedicamento = async () => {
  loading.value = true
  try {
    // Simular envio para API
    const novoAnuncio = {
      id: Date.now(),
      ...formulario.value,
      dataPublicacao: new Date().toISOString()
    }
    
    // Emitir evento para o componente pai
    emit('medicamento-anunciado', novoAnuncio)
    
    mostrarMensagem('Medicamento anunciado com sucesso!', 'sucesso')
    
    // Fechar modal após 1.5 segundos
    setTimeout(() => {
      closeModal()
    }, 1500)
    
  } catch (error) {
    console.error('Erro ao anunciar medicamento:', error)
    mostrarMensagem('Erro ao anunciar medicamento. Tente novamente.', 'erro')
  } finally {
    loading.value = false
  }
}

const limparFormulario = () => {
  formulario.value = {
    nome: '',
    quantidade: null,
    validade: '',
    preco: null,
    categoria: '',
    estado: '',
    descricao: ''
  }
}

const mostrarMensagem = (texto, tipo) => {
  mensagem.value = { texto, tipo }
  setTimeout(() => {
    mensagem.value = null
  }, 3000)
}

// Limpar formulário quando o modal for fechado
watch(() => props.show, (newValue) => {
  if (!newValue) {
    limparFormulario()
  }
})
</script>

