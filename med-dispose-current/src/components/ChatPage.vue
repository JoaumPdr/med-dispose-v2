<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-2xl font-bold mb-6">Conversas</h1>
    <div v-if="loadingHospitals" class="text-center py-8">Carregando hospitais...</div>
    <div v-else>
      <label class="block mb-2 font-medium">Escolha um hospital:</label>
      <select v-model="selectedHospitalId" @change="onHospitalChange" class="mb-6 p-2 border rounded w-full max-w-md">
        <option value="" disabled>Selecione...</option>
        <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.nome }}</option>
      </select>
      <div v-if="selectedHospitalId">
        <div class="bg-white rounded shadow p-4 max-w-xl mx-auto mb-4 h-96 overflow-y-auto flex flex-col" ref="chatBox">
          <div v-for="msg in messages" :key="msg.id" :class="msg.fromSelf ? 'text-right' : 'text-left'">
            <div :class="['inline-block px-3 py-2 rounded-lg mb-2', msg.fromSelf ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800']">
              <span class="block text-xs text-gray-500 mb-1">{{ msg.fromSelf ? 'Você' : msg.senderName }}</span>
              {{ msg.text }}
            </div>
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="flex max-w-xl mx-auto">
          <input v-model="newMessage" class="flex-1 border rounded-l px-3 py-2" placeholder="Digite sua mensagem..." />
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../stores/auth'


const hospitals = ref([])
const messages = ref([])
const selectedHospitalId = ref('')
const newMessage = ref('')
const loadingHospitals = ref(true)
const chatBox = ref(null)
const authStore = useAuthStore()

const fetchHospitals = async () => {
  loadingHospitals.value = true
  try {
    const res = await fetch('http://localhost:3000/api/hospitals', {
      headers: { 'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}` }
    })
    const data = await res.json()
    hospitals.value = data.data || []
  } finally {
    loadingHospitals.value = false
  }
}


const fetchMessages = async () => {
  if (!selectedHospitalId.value) return
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
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedHospitalId.value) return
  const res = await fetch(`http://localhost:3000/api/chat/${selectedHospitalId.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token || localStorage.getItem('token')}`
    },
    body: JSON.stringify({ text: newMessage.value })
  })
  const data = await res.json()
  if (data.success) {
    newMessage.value = ''
    await fetchMessages()
  }
}

const onHospitalChange = () => {
  fetchMessages()
}

onMounted(() => {
  fetchHospitals()
})
</script>
