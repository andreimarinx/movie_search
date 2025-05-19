<!-- client/src/App.vue -->
<template>
  <NavBar>
    <template #status>
      <HealthCheckWidget />
    </template>
  </NavBar>

  <div class="container">
    <SearchBar ref="searchBar" :page="page" @results="onResults" />

    <div v-if="loading" class="status"><span class="spinner"></span> Loading…</div>
    <div v-else-if="error" class="status error">Error: {{ error.message }}</div>
    <div v-else-if="!hasSearched" class="status welcome"><span>🔎</span> Start by searching for a movie above!</div>
    <div v-else-if="movies.length === 0" class="status">No results</div>

    <div v-else class="grid">
      <MovieCard v-for="m in movies" :key="m.id" :movie="m" />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="page <= 1">Prev</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page >= totalPages">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import SearchBar from "./components/SearchBar.vue";
import MovieCard from "./components/MovieCard.vue";
import HealthCheckWidget from "./components/HealthCheckWidget.vue";
import NavBar from "./components/NavBar.vue";

const searchBar = ref(null);
const movies = ref([]);
const loading = ref(false);
const error = ref(null);
const page = ref(1);
const totalPages = ref(1);
const lastQuery = ref("");
const hasSearched = ref(false);

//Update onResults to store the last query
function onResults({ data, isLoading, isError, error: err }) {
  loading.value = isLoading;
  error.value = isError ? err : null;

  if (!isLoading && !isError) {
    hasSearched.value = true; 
    //Reset quesry page to 1 on new search
    if (searchBar.value.q !== lastQuery.value) {
      page.value = 1;
      lastQuery.value = searchBar.value.q;
      //Re search if we are not on page 1 already
      if (page.value !== data.page) {
        nextTick(() => {
          searchBar.value.performSearch();
        });
        return;
      }
    }

    movies.value = Array.isArray(data.results) ? data.results : [];
    totalPages.value = data.totalPages || 1;
    if (typeof data.page === "number" && data.page > 0) {
      page.value = data.page;
    }
    lastQuery.value = searchBar.value.q;
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
    searchBar.value.q = lastQuery.value;
    loading.value = true; 
    nextTick(() => {
      searchBar.value.performSearch();
    });
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++;
    searchBar.value.q = lastQuery.value;
    loading.value = true; 
    nextTick(() => {
      searchBar.value.performSearch();
    });
  }
}
</script>

<style>
.container {
  margin: 4rem auto;
  padding: 0 1rem;
}

.status {
  margin: 1rem 0;
  font-style: italic;
}

.error {
  color: #c00;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid #ccc;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 0.5em;
  vertical-align: middle;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.welcome {
  text-align: center;
  font-size: 1.2rem;
  color: #e2e2e2;
}
</style>
