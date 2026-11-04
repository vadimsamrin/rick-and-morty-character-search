<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const query = ref('')

function submitSearch() {
  emit('search', query.value)
}
</script>

<template>
  <form class="search-field" @submit.prevent="submitSearch">
    <label class="sr-only" for="character-search">Search characters by name</label>
    <input id="character-search" v-model="query" type="search" placeholder="Try Morty or Summer…" />
    <button class="search-submit" type="submit">Search</button>
  </form>
</template>
