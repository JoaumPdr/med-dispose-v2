<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
    <div
      v-for="hospital in hospitals"
      :key="hospital.id"
      class="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      @mouseenter="showTooltip(hospital.id)"
      @mouseleave="hideTooltip"
    >
      <!-- Hospital Card -->
      <div class="flex items-start space-x-3 md:space-x-4">
        <div class="p-2 md:p-3 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 mb-1 truncate text-sm md:text-base">{{ hospital.name }}</h3>
          <p class="text-xs md:text-sm text-gray-600 mb-2">{{ hospital.specialty }}</p>
          <div class="flex items-center text-xs md:text-sm text-gray-500">
            <svg class="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {{ hospital.distance }} km
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex items-center mb-2">
            <span class="text-xs md:text-sm font-medium text-gray-900 mr-1">{{ hospital.rating }}</span>
            <svg class="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="hospital.status === 'Aberto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ hospital.status }}
          </span>
        </div>
      </div>

      <!-- Hover Tooltip -->
      <div
        v-if="hoveredHospital === hospital.id"
        class="hidden lg:block absolute z-10 w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200 -top-2 left-full ml-2 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style="animation: fadeInUp 0.3s ease-out forwards;"
      >
        <div class="space-y-3">
          <div>
            <h4 class="font-semibold text-gray-900 mb-1">{{ hospital.name }}</h4>
            <p class="text-sm text-gray-600">{{ hospital.fullAddress }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Telefone:</span>
              <p class="text-gray-600">{{ hospital.phone }}</p>
            </div>
            <div>
              <span class="font-medium text-gray-700">Horário:</span>
              <p class="text-gray-600">{{ hospital.hours }}</p>
            </div>
          </div>

          <div>
            <span class="font-medium text-gray-700 mb-2 block">Especialidades:</span>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="spec in hospital.specialties"
                :key="spec"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ spec }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-gray-100">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ hospital.waitTime }}
            </div>
            <button class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Tooltip (shows below card on mobile) -->
      <div
        v-if="hoveredHospital === hospital.id"
        class="lg:hidden absolute z-10 left-0 right-0 top-full mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style="animation: fadeInUp 0.3s ease-out forwards;"
      >
        <div class="space-y-2">
          <div>
            <h4 class="font-semibold text-gray-900 text-sm">{{ hospital.name }}</h4>
            <p class="text-xs text-gray-600">{{ hospital.fullAddress }}</p>
          </div>
          <div class="text-xs text-gray-600">
            <p><span class="font-medium">Tel:</span> {{ hospital.phone }}</p>
            <p><span class="font-medium">Horário:</span> {{ hospital.hours }}</p>
            <p><span class="font-medium">Espera:</span> {{ hospital.waitTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hoveredHospital = ref(null)

const hospitals = ref([
  {
    id: 1,
    name: 'Hospital São Lucas',
    specialty: 'Clínica Geral',
    distance: 2.5,
    rating: 4.8,
    status: 'Aberto',
    fullAddress: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    phone: '(11) 1234-5678',
    hours: '24 horas',
    specialties: ['Cardiologia', 'Neurologia', 'Ortopedia'],
    waitTime: '~15 min'
  },
  {
    id: 2,
    name: 'Clínica Santa Maria',
    specialty: 'Cardiologia',
    distance: 1.8,
    rating: 4.9,
    status: 'Aberto',
    fullAddress: 'Av. Paulista, 456 - Bela Vista, São Paulo - SP',
    phone: '(11) 2345-6789',
    hours: '06:00 - 22:00',
    specialties: ['Cardiologia', 'Endocrinologia'],
    waitTime: '~25 min'
  },
  {
    id: 3,
    name: 'Hospital Municipal',
    specialty: 'Emergência',
    distance: 3.2,
    rating: 4.2,
    status: 'Fechado',
    fullAddress: 'Rua da Saúde, 789 - Vila Madalena, São Paulo - SP',
    phone: '(11) 3456-7890',
    hours: '24 horas',
    specialties: ['Emergência', 'Clínica Geral', 'Pediatria'],
    waitTime: '~45 min'
  }
])

const showTooltip = (hospitalId) => {
  hoveredHospital.value = hospitalId
}

const hideTooltip = () => {
  hoveredHospital.value = null
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive tooltip positioning */
@media (max-width: 768px) {
  .group:hover .absolute {
    left: 0;
    right: 0;
    top: 100%;
    margin-left: 0;
    margin-top: 0.5rem;
    width: auto;
  }
}
</style>