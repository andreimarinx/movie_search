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
    const response = await axios.get("http://localhost:3000/search", {
      params: {
        title: q.value,
        page: props.page,
      },
      headers: {
        "x-api-key": "568bf22fs", //TODO replace from .env
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
}

input {
  flex: 1;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
}
</style>
