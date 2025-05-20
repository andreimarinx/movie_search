<!-- client/src/components/SearchBar.vue -->

<template>
  <form @submit.prevent="performSearch" class="search-form">
    <input v-model="q" type="text" placeholder="Search movies…" required />
    <button type="submit" :disabled="isLoading">Search</button>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["results"]);

const q = ref("");
const isLoading = ref(false);
const isError = ref(false);
const error = ref(null);

async function performSearch() {
  if (!q.value.trim()) return;

  isLoading.value = true;
  isError.value = false;
  error.value = null;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/search`, {
      params: {
        title: q.value,
        page: props.page,
      },
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    });

    emit("results", {
      data: response.data,
      isLoading: false,
      isError: false,
      error: null,
    });
  } catch (err) {
    isError.value = true;
    error.value = err;
    emit("results", {
      data: null,
      isLoading: false,
      isError: true,
      error: err,
    });
  } finally {
    isLoading.value = false;
  }
}

defineExpose({ performSearch, q });
</script>

<style scoped>
.search-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap; 
  align-items: center;
}

input {
  flex: 1;
  min-width: 0; 
  padding: 0.5rem 0.75rem;
  border: 1px solid gray;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus {
  outline: none;
  border-color: orange;
  box-shadow: 0 0 0 3px rgba(246, 140, 59, 0.2);
}

button {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .search-form {
    flex-direction: column;
    gap: 0.75rem;
  }
  input,
  button {
    width: 100%;
  }
}
</style>
