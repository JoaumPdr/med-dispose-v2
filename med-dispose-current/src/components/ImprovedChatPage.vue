<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header aprimorado -->
    <div class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
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
            
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <MessageCircleIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-900">Conversas</h1>
                <p class="text-sm text-slate-600">Comunicação em tempo real com hospitais</p>
              </div>
            </div>
          </div>

          <!-- Status de conexão -->
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-slate-600">Online</span>
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
        <!-- Hospital Selection aprimorada -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <label class="flex items-center text-sm font-medium text-slate-700 mb-4">
            <HospitalIcon class="h-4 w-4 mr-2 text-slate-500" />
            Escolha um hospital para conversar:
          </label>
          
          <!-- Grid de hospitais -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="hospital in hospitals"
              :key="hospital.id"
              @click="selectHospital(hospital)"
              class="p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
              :class="selectedHospitalId === hospital.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-slate-200 hover:border-slate-300'"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <HospitalIcon class="h-5 w-5 text-green-600" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-slate-900">{{ hospital.nome }}</h3>
                  <p class="text-sm text-slate-500">Disponível</p>
                </div>
                <div v-if="selectedHospitalId === hospital.id" class="text-blue-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Interface aprimorada -->
        <div v-if="selectedHospitalId" class="grid lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <!-- Chat Header -->
            <div class="bg-white rounded-t-xl shadow-sm border border-slate-200 border-b-0 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <div class="p-2 bg-green-100 rounded-lg">
                      <HospitalIcon class="h-5 w-5 text-green-600" />
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-900">{{ selectedHospital?.nome }}</h3>
                    <p class="text-sm text-slate-500">Online • Responde em poucos minutos</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2 text-sm text-slate-500">
                    <UsersIcon class="h-4 w-4" />
                    <span>{{ messages.length }} mensagens</span>
                  </div>
                  <button
                    @click="clearChat"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Limpar conversa"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Container aprimorado -->
            <div class="bg-white border border-slate-200 h-96 lg:h-[32rem] overflow-y-auto" ref="chatBox">
              <div v-if="loadingMessages" class="flex items-center justify-center h-full">
                <div class="text-center">
                  <LoaderIcon class="h-6 w-6 text-blue-600 animate-spin mx-auto mb-3" />
                  <p class="text-slate-500">Carregando mensagens...</p>
                </div>
              </div>
              
              <div v-else-if="messages.length === 0" class="flex items-center justify-center h-full">
                <div class="text-center max-w-sm">
                  <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircleIcon class="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 class="text-slate-900 font-medium mb-2">Inicie uma conversa</h3>
                  <p class="text-sm text-slate-500">Envie uma mensagem para começar a conversar com {{ selectedHospital?.nome }}</p>
                </div>
              </div>
              
              <div v-else class="p-6 space-y-4">
                <div v-for="msg in messages" :key="msg.id" :class="['flex', msg.fromSelf ? 'justify-end' : 'justify-start']">
                  <div :class="['max-w-xs lg:max-w-md', msg.fromSelf ? 'order-2' : 'order-1']">
                    <!-- Avatar -->
                    <div v-if="!msg.fromSelf" class="flex items-center mb-1">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span class="text-xs font-medium text-green-600">{{ msg.senderName?.charAt(0) || 'H' }}</span>
                      </div>
                      <span class="text-xs text-slate-500">{{ msg.senderName }}</span>
                    </div>
                    
                    <div :class="[
                      'rounded-2xl px-4 py-3 relative',
                      msg.fromSelf 
                        ? 'bg-blue-600 text-white ml-8' 
                        : 'bg-slate-100 text-slate-900 mr-8'
                    ]">
                      <p class="text-sm leading-relaxed break-words">{{ msg.text }}</p>
                      <div v-if="msg.createdAt" :class="[
                        'text-xs mt-2 flex items-center justify-end',
                        msg.fromSelf ? 'text-blue-200' : 'text-slate-400'
                      ]">
                        <ClockIcon class="h-3 w-3 mr-1" />
                        {{ formatTime(msg.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Indicador de digitação -->
                <div v-if="isTyping" class="flex justify-start">
                  <div class="max-w-xs lg:max-w-md">
                    <div class="bg-slate-100 rounded-2xl px-4 py-3 mr-8">
                      <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input aprimorado -->
            <div class="bg-white rounded-b-xl shadow-sm border border-slate-200 border-t-0 p-6">
              <form @submit.prevent="sendMessage" class="space-y-4">
                <!-- Barra de ferramentas -->
                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="insertEmoji('😊')"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Adicionar emoji"
                  >
                    <span class="text-lg">😊</span>
                  </button>
                  <button
                    type="button"
                    @click="insertEmoji('👍')"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span class="text-lg">👍</span>
                  </button>
                  <button
                    type="button"
                    @click="insertEmoji('❤️')"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span class="text-lg">❤️</span>
                  </button>
                </div>

                <!-- Input de mensagem -->
                <div class="flex space-x-3">
                  <div class="flex-1">
                    <textarea
                      v-model="newMessage"
                      @keypress="handleKeyPress"
                      @input="handleTyping"
                      placeholder="Digite sua mensagem..."
                      class="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-slate-400"
                      rows="2"
                      :disabled="sendingMessage"
                    />
                  </div>
                  <button
                    type="submit"
                    :disabled="!newMessage.trim() || sendingMessage"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 self-end"
                  >
                    <LoaderIcon v-if="sendingMessage" class="h-4 w-4 animate-spin" />
                    <SendIcon v-else class="h-4 w-4" />
                    <span class="hidden sm:inline">{{ sendingMessage ? 'Enviando...' : 'Enviar' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Sidebar aprimorada -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Informações do hospital -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 class="font-semibold text-slate-900 mb-4">Informações do Hospital</h4>
              <div class="space-y-4">
                <div class="flex items-center space-x-3 text-sm">
                  <HospitalIcon class="h-4 w-4 text-slate-400" />
                  <span class="text-slate-600">{{ selectedHospital?.nome }}</span>
                </div>
                <div class="flex items-center space-x-3 text-sm">
                  <UsersIcon class="h-4 w-4 text-slate-400" />
                  <span class="text-slate-600">{{ messages.length }} mensagens trocadas</span>
                </div>
                <div class="flex items-center space-x-3 text-sm">
                  <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span class="text-slate-600">Online agora</span>
                </div>
              </div>
            </div>

            <!-- Ações rápidas -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 class="font-semibold text-slate-900 mb-4">Ações Rápidas</h4>
              <div class="space-y-3">
                <button
                  @click="sendQuickMessage('Olá! Gostaria de informações sobre medicamentos disponíveis.')"
                  class="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  💊 Consultar medicamentos
                </button>
                <button
                  @click="sendQuickMessage('Preciso de ajuda com o descarte de medicamentos.')"
                  class="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  ♻️ Descarte de medicamentos
                </button>
                <button
                  @click="sendQuickMessage('Gostaria de agendar uma visita.')"
                  class="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  📅 Agendar visita
                </button>
              </div>
            </div>

            <!-- Estatísticas -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 class="font-semibold text-slate-900 mb-4">Estatísticas</h4>
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Mensagens enviadas</span>
                  <span class="font-medium text-slate-900">{{ messagesSent }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Mensagens recebidas</span>
                  <span class="font-medium text-slate-900">{{ messagesReceived }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-600">Tempo de resposta médio</span>
                  <span class="font-medium text-slate-900">2 min</span>
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
const isTyping = ref(false)
const chatBox = ref(null)
const authStore = useAuthStore()

const selectedHospital = computed(() => 
  hospitals.value.find(h => h.id === selectedHospitalId.value)
)

const messagesSent = computed(() => 
  messages.value.filter(m => m.fromSelf).length
)

const messagesReceived = computed(() => 
  messages.value.filter(m => !m.fromSelf).length
)

const scrollToBottom = () => {
  if (chatBox.value) {
    nextTick(() => {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    })
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

const handleTyping = () => {
  // Simular indicador de digitação
  if (newMessage.value.length > 0) {
    // Aqui você poderia enviar um evento de "digitando" para o servidor
  }
}

const insertEmoji = (emoji) => {
  newMessage.value += emoji
}

const selectHospital = (hospital) => {
  selectedHospitalId.value = hospital.id
  fetchMessages()
}

const clearChat = () => {
  if (confirm('Tem certeza que deseja limpar esta conversa?')) {
    messages.value = []
  }
}

const sendQuickMessage = (message) => {
  newMessage.value = message
  sendMessage()
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
    scrollToBottom()
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error)
    // Mensagens de exemplo para demonstração
    messages.value = [
      {
        id: '1',
        text: 'Olá! Bem-vindo ao nosso sistema de chat. Como posso ajudá-lo hoje?',
        senderId: 'other-user',
        senderName: 'Dr. Maria Santos',
        fromSelf: false,
        createdAt: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        text: 'Olá! Gostaria de saber sobre os medicamentos disponíveis para descarte.',
        senderId: authStore.user?.id || 'current-user',
        senderName: 'Você',
        fromSelf: true,
        createdAt: new Date(Date.now() - 240000).toISOString()
      },
      {
        id: '3',
        text: 'Claro! Temos vários medicamentos disponíveis. Você pode consultar nossa lista atualizada no sistema. Há algum medicamento específico que você está procurando?',
        senderId: 'other-user',
        senderName: 'Dr. Maria Santos',
        fromSelf: false,
        createdAt: new Date(Date.now() - 180000).toISOString()
      }
    ]
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

  // Simular indicador de digitação do hospital
  setTimeout(() => {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
    }, 2000)
  }, 1000)

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
      senderId: authStore.user?.id || 'current-user',
      senderName: 'Você',
      fromSelf: true,
      createdAt: new Date().toISOString()
    }
    messages.value.push(newMsg)
    scrollToBottom()

    // Simular resposta automática
    setTimeout(() => {
      const autoReply = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Nossa equipe irá analisar e responder em breve.',
        senderId: 'other-user',
        senderName: selectedHospital.value?.nome || 'Hospital',
        fromSelf: false,
        createdAt: new Date().toISOString()
      }
      messages.value.push(autoReply)
      scrollToBottom()
    }, 2000)
  } finally {
    sendingMessage.value = false
  }
}

onMounted(() => {
  fetchHospitals()
})
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>

