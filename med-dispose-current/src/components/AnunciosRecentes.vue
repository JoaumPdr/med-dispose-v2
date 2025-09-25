<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">Medicamentos Anunciados</h2>
      <button 
        @click="$emit('ver-todos')"
        class="text-orange-600 hover:text-orange-700 font-medium text-sm md:text-base transition-colors"
      >
        Ver todos
      </button>
    </div>

    <div v-if="anunciosRecentes.length === 0" class="text-center py-8">
      <div class="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
        </svg>
      </div>
      <p class="text-gray-500 font-medium">Nenhum medicamento anunciado ainda</p>
      <p class="text-sm text-gray-400 mt-1">Use o botão "Anunciar Medicamentos" para começar</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="anuncio in anunciosRecentes"
        :key="anuncio.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-semibold text-gray-900 text-lg">{{ anuncio.nome }}</h3>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Disponível
          </span>
        </div>
        
        <div class="space-y-1 text-sm text-gray-600 mb-3">
          <p><span class="font-medium">Quantidade:</span> {{ anuncio.quantidade }} unidades</p>
          <p><span class="font-medium">Validade:</span> {{ formatarData(anuncio.validade) }}</p>
          <p><span class="font-medium">Preço:</span> R$ {{ anuncio.preco.toFixed(2) }}</p>
          <p><span class="font-medium">Estado:</span> {{ anuncio.estado }}</p>
        </div>

        <div v-if="anuncio.descricao" class="text-sm text-gray-500 mb-3">
          {{ anuncio.descricao }}
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400">
            {{ formatarDataPublicacao(anuncio.dataPublicacao) }}
          </span>
          <button
            @click="$emit('contatar-anunciante', anuncio)"
            class="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
          >
            Contatar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAnunciosStore } from '../stores/anuncios'

const anunciosStore = useAnunciosStore()

const anunciosRecentes = computed(() => anunciosStore.obterAnunciosRecentes(4))

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const formatarDataPublicacao = (data) => {
  const agora = new Date()
  const dataPublicacao = new Date(data)
  const diffMs = agora - dataPublicacao
  const diffMinutos = Math.floor(diffMs / (1000 * 60))
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutos < 60) {
    return `${diffMinutos} min atrás`
  } else if (diffHoras < 24) {
    return `${diffHoras}h atrás`
  } else {
    return `${diffDias} dias atrás`
  }
}

defineEmits(['ver-todos', 'contatar-anunciante'])
</script>

