<!-- client/src/components/HealthCheckWidget.vue -->

<template>
  <div class="health-widget" :class="{ online: isOnline, offline: !isOnline }">
    API Status:
    <span>{{ isOnline ? '🟢 Online' : '🔴 Offline' }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const isOnline = ref(false)

async function checkHealth() {
  try {
    const res = await axios.get('http://localhost:3000/api/health')
    isOnline.value = res.status === 200
  } catch {
    isOnline.value = false
  }
}

onMounted(() => {
  checkHealth()
  setInterval(checkHealth, 30000)
})
</script>

<style scoped>
.health-widget {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 1rem;
  display: inline-block;
}

.online {
  color: green;
  border-color: green;
}

.offline {
  color: red;
  border-color: red;
}
</style>
