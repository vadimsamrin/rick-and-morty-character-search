<script setup>
import { onMounted, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'

const characters = ref([])
const query = ref('')
const page = ref(1)
const pages = ref(1)
const loading = ref(false)
const noResults = ref(false)

async function fetchCharacters(name = query.value, nextPage = 1) {
  query.value = name
  page.value = nextPage
  loading.value = true
  noResults.value = false
  const params = new URLSearchParams({ page: String(nextPage) })
  if (name.trim()) params.set('name', name.trim())
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character?${params}`)
    if (response.status === 404) {
      characters.value = []
      noResults.value = true
      return
    }
    const data = await response.json()
    characters.value = data.results
    pages.value = data.info.pages
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchCharacters('', 1))
</script>

<template>
  <main class="page-shell">
    <header class="topbar"><a class="brand" href="#"><span class="brand-mark">D<span>·</span>I</span><span class="brand-name">DIMENSION<br />INDEX</span></a><div class="topbar-note">FIELD GUIDE / EARTH C-137</div></header>
    <section class="hero">
      <div class="eyebrow"><span class="eyebrow-line"></span> THE MULTIVERSE, CATALOGUED</div>
      <h1>Find your<br /><span>character.</span></h1>
      <p class="intro">A field guide to the strange, familiar, and somewhere-in-between.<br />Search the known dimensions by name.</p>
      <div class="search-row"><SearchBar @search="(name) => fetchCharacters(name, 1)" /></div>
      <div class="search-meta"><span class="status-text">{{ loading ? 'Scanning dimensions…' : noResults ? 'No characters found' : `${characters.length} characters on this page` }}</span></div>
    </section>
    <section class="results-section">
      <div class="section-heading"><div><span class="section-index">01</span><h2>Known residents</h2></div></div>
      <p v-if="noResults" class="empty-state">No characters found. Try another name.</p>
      <div v-else class="character-grid">
        <article v-for="character in characters" :key="character.id" class="character-card">
          <div class="portrait-wrap"><img :src="character.image" :alt="character.name" /><span class="status-pill">{{ character.status }}</span></div>
          <div class="card-info"><div class="card-species">{{ character.species }}</div><h3>{{ character.name }}</h3><div class="card-location">⌖ {{ character.location.name }}</div></div>
        </article>
      </div>
      <nav v-if="pages > 1" class="pagination"><button class="page-button" :disabled="page === 1" @click="fetchCharacters(query, page - 1)">← Previous</button><span>{{ page }} / {{ pages }}</span><button class="page-button" :disabled="page === pages" @click="fetchCharacters(query, page + 1)">Next →</button></nav>
    </section>
    <footer class="footer">DIMENSION INDEX · DATA VIA RICK AND MORTY API</footer>
  </main>
</template>
