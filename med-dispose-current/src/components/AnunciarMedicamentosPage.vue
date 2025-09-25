<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
    <!-- Header com botão de voltar -->
    <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div class="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="group flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="font-medium">Voltar</span>
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Anunciar Medicamentos</h1>
              <p class="text-sm text-gray-600 hidden sm:block">Compartilhe medicamentos disponíveis</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Formulário de anúncio -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden transform hover:shadow-2xl transition-shadow duration-300">
          <div class="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 sm:px-8 sm:py-6">
            <h2 class="text-xl sm:text-2xl font-bold text-white mb-1">Publicar Medicamento</h2>
            <p class="text-orange-100 text-sm sm:text-base">Anuncie medicamentos disponíveis para outros hospitais</p>
          </div>

          <div class="p-6 sm:p-8">
            <form @submit.prevent="anunciarMedicamento" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <!-- Nome do Medicamento -->
                <div class="sm:col-span-2 lg:col-span-1">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Medicamento
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="formulario.nome"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                      placeholder="Ex: Dipirona 500mg"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Quantidade -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Quantidade
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="formulario.quantidade"
                    type="number"
                    min="1"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                    placeholder="100"
                  />
                </div>

                <!-- Data de Validade -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Validade
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formulario.validade"
                    type="date"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                  />
                </div>

                <!-- Preço -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Preço/Unidade (R$)
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input
                      v-model.number="formulario.preco"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                      placeholder="2,50"
                    />
                  </div>
                </div>

                <!-- Categoria -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria
                    <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formulario.categoria"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 appearance-none bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="analgesico">💊 Analgésico</option>
                    <option value="antibiotico">🦠 Antibiótico</option>
                    <option value="anti-inflamatorio">🩹 Anti-inflamatório</option>
                    <option value="cardiovascular">❤️ Cardiovascular</option>
                    <option value="diabetes">🍭 Diabetes</option>
                    <option value="outros">📋 Outros</option>
                  </select>
                </div>

                <!-- Estado de Conservação -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                    <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formulario.estado"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 appearance-none bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="excelente">✨ Excelente</option>
                    <option value="bom">👍 Bom</option>
                    <option value="regular">⚠️ Regular</option>
                  </select>
                </div>
              </div>

              <!-- Descrição -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição Adicional</label>
                <textarea
                  v-model="formulario.descricao"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 resize-none"
                  placeholder="Informações adicionais sobre o medicamento, condições especiais de armazenamento, etc..."
                ></textarea>
              </div>

              <!-- Botões -->
              <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <button
                  type="button"
                  @click="limparFormulario"
                  class="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  🗑️ Limpar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publicando...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    📢 Publicar Anúncio
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Lista de anúncios ativos -->
      <div class="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 sm:px-8 sm:py-6 border-b border-orange-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-gray-800">Meus Anúncios Ativos</h3>
              <p class="text-gray-600 text-sm">{{ anuncios.length }} {{ anuncios.length === 1 ? 'anúncio' : 'anúncios' }} {{ anuncios.length === 1 ? 'ativo' : 'ativos' }}</p>
            </div>
            <div class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              {{ anuncios.length }}
            </div>
          </div>
        </div>
        
        <div class="p-6 sm:p-8">
          <div v-if="anuncios.length === 0" class="text-center py-12">
            <div class="mb-4">
              <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-600 mb-2">Nenhum anúncio ativo</h4>
            <p class="text-gray-500 max-w-md mx-auto">Quando você publicar medicamentos, eles aparecerão aqui para que outros hospitais possam visualizar.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="anuncio in anuncios"
              :key="anuncio.id"
              class="group bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 rounded-2xl p-6 hover:shadow-xl hover:border-orange-200 transform hover:-translate-y-1 transition-all duration-300"
            >
              <div class="flex items-start justify-between mb-4">
                <h4 class="font-bold text-gray-800 text-lg leading-tight">{{ anuncio.nome }}</h4>
                <span class="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 animate-pulse">
                  ● ATIVO
                </span>
              </div>
              
              <div class="space-y-3 mb-6">
                <div class="flex items-center space-x-2 text-sm">
                  <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">📦</span>
                  <span class="text-gray-600">Quantidade:</span>
                  <span class="font-semibold text-gray-800">{{ anuncio.quantidade }}</span>
                </div>
                
                <div class="flex items-center space-x-2 text-sm">
                  <span class="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold">📅</span>
                  <span class="text-gray-600">Validade:</span>
                  <span class="font-semibold text-gray-800">{{ formatarData(anuncio.validade) }}</span>
                </div>
                
                <div class="flex items-center space-x-2 text-sm">
                  <span class="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-bold">💰</span>
                  <span class="text-gray-600">Preço:</span>
                  <span class="font-bold text-green-600">R$ {{ anuncio.preco.toFixed(2) }}</span>
                </div>
                
                <div class="flex items-center space-x-2 text-sm">
                  <span class="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">⭐</span>
                  <span class="text-gray-600">Estado:</span>
                  <span class="font-semibold" :class="{
                    'text-green-600': anuncio.estado === 'excelente',
                    'text-blue-600': anuncio.estado === 'bom',
                    'text-yellow-600': anuncio.estado === 'regular'
                  }">{{ anuncio.estado }}</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center pt-4 border-t border-orange-100">
                <span class="text-xs text-gray-500">
                  Publicado em {{ formatarData(anuncio.dataPublicacao) }}
                </span>
                <button
                  @click="removerAnuncio(anuncio.id)"
                  class="group-hover:scale-105 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 border border-red-200 hover:border-red-300"
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensagens de feedback -->
    <Transition name="message" appear>
      <div v-if="mensagem" class="fixed bottom-4 right-4 z-50 max-w-sm">
        <div
          :class="[
            'px-6 py-4 rounded-2xl shadow-2xl border-2 backdrop-blur-sm transform transition-all duration-500',
            mensagem.tipo === 'sucesso' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          ]"
        >
          <div class="flex items-center space-x-3">
            <span class="text-xl">
              {{ mensagem.tipo === 'sucesso' ? '✅' : '❌' }}
            </span>
            <span class="font-semibold">{{ mensagem.texto }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
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

const anuncios = ref([])

const anunciarMedicamento = async () => {
  loading.value = true
  try {
    // Simular envio para API
    const novoAnuncio = {
      id: Date.now(),
      ...formulario.value,
      dataPublicacao: new Date().toISOString()
    }
    
    anuncios.value.push(novoAnuncio)
    
    mostrarMensagem('Medicamento anunciado com sucesso!', 'sucesso')
    limparFormulario()
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

const removerAnuncio = (id) => {
  anuncios.value = anuncios.value.filter(anuncio => anuncio.id !== id)
  mostrarMensagem('Anúncio removido com sucesso!', 'sucesso')
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const mostrarMensagem = (texto, tipo) => {
  mensagem.value = { texto, tipo }
  setTimeout(() => {
    mensagem.value = null
  }, 4000)
}

onMounted(() => {
  // Carregar anúncios existentes
  // Aqui você faria uma chamada para a API
})
</script>

<style scoped>
/* Animações para mensagens */
.message-enter-active, .message-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.message-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

/* Remover setas dos selects */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* Estados de focus aprimorados */
input:focus, select:focus, textarea:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Animações suaves para cards */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.group:hover {
  animation: float 0.6s ease-in-out;
}
</style>