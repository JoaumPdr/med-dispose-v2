<template>
  <div class="h-screen w-screen relative bg-gray-100">
    <!-- Header com informações -->
    <div class="absolute top-0 left-0 right-0 bg-white shadow-lg z-20 border-b border-gray-200">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center space-x-4">
          <!-- Botão de voltar -->
          <button
            @click="$router.go(-1)"
            class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Voltar</span>
          </button>
          
          <div>
            <h1 class="text-xl font-bold text-gray-900">Mapa de Farmácias</h1>
            <p class="text-sm text-gray-600">Encontre farmácias próximas a você</p>
          </div>
        </div>

        <!-- Controles do mapa -->
        <div class="flex items-center space-x-3">
          <button
            @click="centerOnUser"
            class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            :disabled="!userLocation"
          >
            Minha Localização
          </button>
          <button
            @click="toggleSatellite"
            class="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            {{ satelliteView ? 'Mapa' : 'Satélite' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar com lista de farmácias -->
    <div class="absolute left-0 top-20 bottom-0 w-80 bg-white shadow-lg z-10 overflow-y-auto border-r border-gray-200">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Farmácias Próximas</h2>
        
        <!-- Loading state -->
        <div v-if="loadingLocation" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Obtendo localização...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="locationError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p class="text-red-800 text-sm">{{ locationError }}</p>
        </div>

        <!-- Lista de farmácias -->
        <div v-else class="space-y-3">
          <div
            v-for="farmacia in farmaciasComDistancia"
            :key="farmacia.id"
            @click="selectFarmacia(farmacia)"
            class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
            :class="{ 'border-blue-500 bg-blue-50': selectedFarmacia?.id === farmacia.id }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ farmacia.nome }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ farmacia.endereco }}</p>
                <div class="flex items-center mt-2 space-x-4">
                  <span class="text-xs text-blue-600 font-medium">
                    {{ farmacia.distancia ? farmacia.distancia.toFixed(1) + ' km' : 'Calculando...' }}
                  </span>
                  <span class="text-xs text-green-600">Aberto</span>
                </div>
              </div>
              <div class="ml-3">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <div class="absolute left-80 top-20 right-0 bottom-0">
      <div id="map" class="w-full h-full"></div>
    </div>

    <!-- Popup de informações da farmácia selecionada -->
    <div
      v-if="selectedFarmacia"
      class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4 z-20"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedFarmacia.nome }}</h3>
          <p class="text-gray-600 mt-1">{{ selectedFarmacia.endereco }}</p>
          <div class="flex items-center mt-3 space-x-4">
            <span class="text-sm text-blue-600 font-medium">
              {{ selectedFarmacia.distancia ? selectedFarmacia.distancia.toFixed(1) + ' km de distância' : '' }}
            </span>
            <span class="text-sm text-green-600">● Aberto</span>
          </div>
        </div>
        <button
          @click="selectedFarmacia = null"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="flex space-x-3 mt-4">
        <button
          @click="getDirections(selectedFarmacia)"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Como Chegar
        </button>
        <button
          @click="callFarmacia(selectedFarmacia)"
          class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Ligar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const map = ref(null)
const userLocation = ref(null)
const loadingLocation = ref(true)
const locationError = ref(null)
const selectedFarmacia = ref(null)
const satelliteView = ref(false)
const markers = ref([])
const userMarker = ref(null)

const farmacias = ref([
  {
    id: 1,
    nome: 'Drogaria Carvalho',
    endereco: 'Rua das Flores, 123 - Centro',
    latitude: -22.253355,
    longitude: -45.704002,
    telefone: '(35) 3623-1234'
  },
  {
    id: 2,
    nome: 'Drogaria Poupe Já',
    endereco: 'Av. Brasil, 456 - Centro',
    latitude: -22.253847,
    longitude: -45.704235,
    telefone: '(35) 3623-5678'
  },
  {
    id: 3,
    nome: 'FarmaPraça Popular',
    endereco: 'Praça Getúlio Vargas, 789',
    latitude: -22.252751,
    longitude: -45.704849,
    telefone: '(35) 3623-9012'
  },
  {
    id: 4,
    nome: 'Drogaria Ultra Popular',
    endereco: 'Rua Coronel Carneiro, 321',
    latitude: -22.251733,
    longitude: -45.704107,
    telefone: '(35) 3623-3456'
  }
])

// Computed para farmácias com distância calculada
const farmaciasComDistancia = computed(() => {
  if (!userLocation.value) return farmacias.value
  
  return farmacias.value.map(farmacia => ({
    ...farmacia,
    distancia: calculateDistance(
      userLocation.value.lat,
      userLocation.value.lng,
      farmacia.latitude,
      farmacia.longitude
    )
  })).sort((a, b) => (a.distancia || 0) - (b.distancia || 0))
})

// Função para calcular distância entre dois pontos
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Obter localização do usuário
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        loadingLocation.value = false
        initMap()
      },
      (error) => {
        locationError.value = 'Erro ao obter localização: ' + error.message
        loadingLocation.value = false
        // Fallback para localização padrão (Itajubá, MG)
        userLocation.value = { lat: -22.245, lng: -45.69 }
        initMap()
      }
    )
  } else {
    locationError.value = 'Geolocalização não é suportada por este navegador.'
    loadingLocation.value = false
    userLocation.value = { lat: -22.245, lng: -45.69 }
    initMap()
  }
}

// Inicializar mapa
const initMap = () => {
  if (!userLocation.value) return

  // Criar mapa
  map.value = L.map('map').setView([userLocation.value.lat, userLocation.value.lng], 13)

  // Adicionar camada de tiles
  updateMapLayer()

  // Adicionar marcador do usuário
  const userIcon = L.divIcon({
    html: '<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>',
    className: 'custom-user-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })

  userMarker.value = L.marker([userLocation.value.lat, userLocation.value.lng], { icon: userIcon })
    .addTo(map.value)
    .bindPopup('Sua Localização')

  // Adicionar marcadores das farmácias
  addFarmaciaMarkers()
}

// Atualizar camada do mapa
const updateMapLayer = () => {
  if (!map.value) return

  // Remover camadas existentes
  map.value.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.value.removeLayer(layer)
    }
  })

  // Adicionar nova camada
  const tileLayer = satelliteView.value
    ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      })
    : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })

  tileLayer.addTo(map.value)
}

// Adicionar marcadores das farmácias
const addFarmaciaMarkers = () => {
  // Limpar marcadores existentes
  markers.value.forEach(marker => map.value.removeLayer(marker))
  markers.value = []

  // Adicionar novos marcadores
  farmacias.value.forEach(farmacia => {
    const farmaciaIcon = L.divIcon({
      html: '<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>',
      className: 'custom-farmacia-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const marker = L.marker([farmacia.latitude, farmacia.longitude], { icon: farmaciaIcon })
      .addTo(map.value)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${farmacia.nome}</h3>
          <p class="text-sm text-gray-600">${farmacia.endereco}</p>
          <button onclick="window.selectFarmaciaFromMap(${farmacia.id})" class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            Ver Detalhes
          </button>
        </div>
      `)

    markers.value.push(marker)
  })
}

// Selecionar farmácia
const selectFarmacia = (farmacia) => {
  selectedFarmacia.value = farmacia
  if (map.value) {
    map.value.setView([farmacia.latitude, farmacia.longitude], 15)
  }
}

// Centralizar no usuário
const centerOnUser = () => {
  if (map.value && userLocation.value) {
    map.value.setView([userLocation.value.lat, userLocation.value.lng], 15)
  }
}

// Alternar vista satélite
const toggleSatellite = () => {
  satelliteView.value = !satelliteView.value
  updateMapLayer()
}

// Obter direções
const getDirections = (farmacia) => {
  if (userLocation.value) {
    const url = `https://www.google.com/maps/dir/${userLocation.value.lat},${userLocation.value.lng}/${farmacia.latitude},${farmacia.longitude}`
    window.open(url, '_blank')
  }
}

// Ligar para farmácia
const callFarmacia = (farmacia) => {
  if (farmacia.telefone) {
    window.open(`tel:${farmacia.telefone}`)
  }
}

// Função global para seleção via popup
window.selectFarmaciaFromMap = (farmaciaId) => {
  const farmacia = farmacias.value.find(f => f.id === farmaciaId)
  if (farmacia) {
    selectFarmacia(farmacia)
  }
}

onMounted(() => {
  nextTick(() => {
    getUserLocation()
  })
})
</script>

<style scoped>
:deep(.custom-user-marker) {
  background: transparent;
  border: none;
}

:deep(.custom-farmacia-marker) {
  background: transparent;
  border: none;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.leaflet-popup-content) {
  margin: 8px;
}
</style>

