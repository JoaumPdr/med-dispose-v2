import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnunciosStore = defineStore('anuncios', () => {
  const anuncios = ref([])

  const adicionarAnuncio = (anuncio) => {
    anuncios.value.push(anuncio)
  }

  const removerAnuncio = (id) => {
    const index = anuncios.value.findIndex(anuncio => anuncio.id === id)
    if (index !== -1) {
      anuncios.value.splice(index, 1)
    }
  }

  const obterAnuncios = () => {
    return anuncios.value
  }

  const obterAnunciosRecentes = (limite = 5) => {
    return anuncios.value
      .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao))
      .slice(0, limite)
  }

  return {
    anuncios,
    adicionarAnuncio,
    removerAnuncio,
    obterAnuncios,
    obterAnunciosRecentes
  }
})

