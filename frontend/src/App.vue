<!-- client/src/App.vue -->
<template>
  <div class="container">
    <h1>Movie Search</h1>

    <SearchBar ref="searchBar" :page="page" @results="onResults" />

    <!-- Loading / Error / No Results States -->
    <div v-if="loading" class="status">Loading…</div>
    <div v-else-if="error" class="status error">Error: {{ error.message }}</div>
    <div v-else-if="movies.length === 0" class="status">No results</div>

    <!-- Results Grid -->
    <div v-else class="grid">
      <MovieCard v-for="m in movies" :key="m.id" :movie="m" />
    </div>

    <!-- Pagination Controls -->
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

const searchBar = ref(null);
const movies = ref([]);
const loading = ref(false);
const error = ref(null);
const page = ref(1);
const totalPages = ref(1);
const lastQuery = ref("");

//Update onResults to store the last query
function onResults({ data, isLoading, isError, error: err }) {
  loading.value = isLoading;
  error.value = isError ? err : null;

  if (!isLoading && !isError) {
    //If the query has changed, reset page to 1 and re-search
    if (searchBar.value.q !== lastQuery.value) {
      page.value = 1;
      lastQuery.value = searchBar.value.q;
      // Only re-search if we weren't already on page 1
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
    nextTick(() => {
      searchBar.value.performSearch();
    });
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++;
    searchBar.value.q = lastQuery.value;
    nextTick(() => {
      searchBar.value.performSearch();
    });
  }
}
</script>

<style>
.container {
  max-width: 600px;
  margin: 2rem auto;
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
  grid-template-columns: 1fr 1fr;
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
</style>
