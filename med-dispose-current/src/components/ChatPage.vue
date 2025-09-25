<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
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
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <MessageCircleIcon class="h-6 w-6 text-blue-600" />
              </div>
              <h1 class="text-2xl font-bold text-slate-900">Conversas</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loadingHospitals" class="flex flex-col items-center justify-center py-12">
        <LoaderIcon class="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p class="text-slate-600">Carregando hospitais...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Hospital Selection -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <label class="flex items-center text-sm font-medium text-slate-700 mb-3">
            <HospitalIcon class="h-4 w-4 mr-2 text-slate-500" />
            Escolha um hospital:
          </label>
          <div class="relative">
            <select
              v-model="selectedHospitalId"
              @change="onHospitalChange"
              class="w-full max-w-md appearance-none bg-white border border-slate-300 rounded-lg px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
            >
              <option value="" disabled>Selecione um hospital...</option>
              <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.nome }}</option>
            </select>
            <ChevronDownIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <!-- Chat Interface -->
        <div v-if="selectedHospitalId" class="grid lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <!-- Chat Header -->
            <div class="bg-white rounded-t-xl shadow-sm border border-slate-200 border-b-0 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <HospitalIcon class="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-900">{{ selectedHospital?.nome }}</h3>
                    <p class="text-sm text-slate-500">Chat em tempo real</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2 text-sm text-slate-500">
                  <UsersIcon class="h-4 w-4" />
                  <span>{{ messages.length > 0 ? 'Ativo' : 'Aguardando mensagens' }}</span>
                </div>
              </div>
            </div>

            <!-- Messages Container -->
            <div class="bg-white border border-slate-200 h-96 lg:h-[32rem] overflow-y-auto" ref="chatBox">
              <div v-if="loadingMessages" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <LoaderIcon class="h-6 w-6 text-blue-600 animate-spin mx-auto mb-3" />
                  <p class="text-slate-500">Carregando mensagens...</p>
                </div>
              </div>
              
              <div v-else-if="messages.length === 0" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <MessageCircleIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p class="text-slate-500 font-medium">Nenhuma mensagem ainda</p>
                  <p class="text-sm text-slate-400">Comece uma conversa digitando abaixo</p>
                </div>
              </div>
              
              <div v-else class="p-6 space-y-4">
                <div v-for="msg in messages" :key="msg.id" :class="['flex', msg.fromSelf ? 'justify-end' : 'justify-start']">
                  <div :class="['max-w-xs lg:max-w-md', msg.fromSelf ? 'order-2' : 'order-1']">
                    <div :class="[
                      'rounded-2xl px-4 py-3',
                      msg.fromSelf 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    ]">
                      <div :class="[
                        'text-xs font-medium mb-1',
                        msg.fromSelf ? 'text-blue-100' : 'text-slate-500'
                      ]">
                        {{ msg.fromSelf ? 'Você' : msg.senderName }}
                      </div>
                      <p class="text-sm leading-relaxed break-words">{{ msg.text }}</p>
                      <div v-if="msg.createdAt" :class="[
                        'text-xs mt-1 flex items-center',
                        msg.fromSelf ? 'text-blue-200' : 'text-slate-400'
                      ]">
                        <ClockIcon class="h-3 w-3 mr-1" />
                        {{ formatTime(msg.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="bg-white rounded-b-xl shadow-sm border border-slate-200 border-t-0 p-6">
              <form @submit.prevent="sendMessage" class="flex space-x-3">
                <div class="flex-1">
                  <textarea
                    v-model="newMessage"
                    @keypress="handleKeyPress"
                    placeholder="Digite sua mensagem..."
                    class="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-slate-400"
                    rows="1"
                    :disabled="sendingMessage"
                  />
                </div>
                <button
                  type="submit"
                  :disabled="!newMessage.trim() || sendingMessage"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <LoaderIcon v-if="sendingMessage" class="h-4 w-4 animate-spin" />
                  <SendIcon v-else class="h-4 w-4" />
                  <span class="hidden sm:inline">Enviar</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 class="font-semibold text-slate-900 mb-4">Informações</h4>
              <div class="space-y-4">
                <div class="flex items-center space-x-3 text-sm">
                  <HospitalIcon class="h-4 w-4 text-slate-400" />
                  <span class="text-slate-600">{{ selectedHospital?.nome }}</span>
                </div>
                <div class="flex items-center space-x-3 text-sm">
                  <UsersIcon class="h-4 w-4 text-slate-400" />
                  <span class="text-slate-600">{{ messages.length }} mensagens</span>
                </div>
                <div class="flex items-center space-x-3 text-sm">
                  <MessageCircleIcon class="h-4 w-4 text-slate-400" />
                  <span class="text-slate-600">Chat ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { 
  MessageCircle as MessageCircleIcon,
  Hospital as HospitalIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  ChevronDown as ChevronDownIcon,
  Loader2 as LoaderIcon,
  Send as SendIcon
} from 'lucide-vue-next'

const hospitals = ref([])
const messages = ref([])
const selectedHospitalId = ref('')
const newMessage = ref('')
const loadingHospitals = ref(true)
const loadingMessages = ref(false)
const sendingMessage = ref(false)
const chatBox = ref(null)
const authStore = useAuthStore()

const selectedHospital = computed(() => 
  hospitals.value.find(h => h.id === selectedHospitalId.value)
)

const scrollToBottom = () => {
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  }
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const fetchHospitals = async () => {
  loadingHospitals.value = true
  try {
    const res = await fetch('http://localhost:3000/api/hospitals', {
      headers: { 'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}` }
    })
    const data = await res.json()
    hospitals.value = data.data || []
  } catch (error) {
    console.error('Erro ao carregar hospitais:', error)
    // Dados de exemplo para demonstração
    hospitals.value = [
      { id: '1', nome: 'Hospital São Lucas' },
      { id: '2', nome: 'Hospital Santa Maria' },
      { id: '3', nome: 'Hospital Central' },
      { id: '4', nome: 'Clínica Norte' }
    ]
  } finally {
    loadingHospitals.value = false
  }
}

const fetchMessages = async () => {
  if (!selectedHospitalId.value) return
  
  loadingMessages.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/chat/${selectedHospitalId.value}`, {
      headers: { 'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}` }
    })
    const data = await res.json()
    messages.value = (data.data || []).map(msg => ({
      ...msg,
      fromSelf: msg.senderId === authStore.user.id,
      senderName: msg.senderName || 'Outro usuário'
    }))
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error)
    // Mensagens de exemplo para demonstração
    messages.value = [
      {
        id: '1',
        text: 'Olá! Como posso ajudar hoje?',
        senderId: 'other-user',
        senderName: 'Dr. Maria Santos',
        fromSelf: false,
        createdAt: new Date(Date.now() - 120000).toISOString()
      },
      {
        id: '2',
        text: 'Preciso discutir o caso do paciente João.',
        senderId: authStore.user.id,
        senderName: 'Você',
        fromSelf: true,
        createdAt: new Date(Date.now() - 60000).toISOString()
      }
    ]
    await nextTick()
    scrollToBottom()
  } finally {
    loadingMessages.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedHospitalId.value) return
  
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  sendingMessage.value = true

  try {
    const res = await fetch(`http://localhost:3000/api/chat/${selectedHospitalId.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}`
      },
      body: JSON.stringify({ text: messageText })
    })
    const data = await res.json()
    
    if (data.success) {
      await fetchMessages()
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    // Simular envio para demonstração
    const newMsg = {
      id: Date.now().toString(),
      text: messageText,
      senderId: authStore.user.id,
      senderName: 'Você',
      fromSelf: true,
      createdAt: new Date().toISOString()
    }
    messages.value.push(newMsg)
    await nextTick()
    scrollToBottom()
  } finally {
    sendingMessage.value = false
  }
}

const onHospitalChange = () => {
  fetchMessages()
}

onMounted(() => {
  fetchHospitals()
})
</script>