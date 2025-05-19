<!-- client/src/components/MovieCard.vue -->
 
<template>
  <div class="card">
    <img v-if="movie.posterPath" :src="movie.posterPath" :alt="`Poster for ${movie.title}`" />
    <h2>
      {{ movie.title }}
      <small>({{ displayYear }})</small>
    </h2>
    <p>{{ movie.overview }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const rawDate = props.movie.releaseDate || "";
const m = rawDate.match(/(\d{4})$/);
const displayYear = m ? m[1] : rawDate || "N/A";
</script>

<style>
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}
img {
  display: block;
  margin-bottom: 0.5rem;
  width: 100%;
  border-radius: 4px;
}
h2 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
small {
  color: #b7b7b7;
}
p {
  font-size: 12px;
}
</style>
