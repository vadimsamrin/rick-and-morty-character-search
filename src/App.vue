<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import PaginationBar from './components/PaginationBar.vue'

const API = 'https://rickandmortyapi.com/api/character'
const query = ref('')
const characters = ref([])
const page = ref(1)
const total = ref(0)
const pages = ref(1)
const loading = ref(false)
const error = ref('')
const hasSearched = ref(false)
const characterList = ref(null)
let controller

const trimmedQuery = computed(() => query.value.trim())
const rangeStart = computed(() => (page.value - 1) * 20 + 1)
const rangeEnd = computed(() => Math.min(page.value * 20, total.value))

/*
Stage 2 — questions from the exercise:
1. Typing “morty” makes 5 requests (one per keystroke).
2. If the request for keystroke 2 arrives after keystroke 5, stale results can overwrite the latest query.
3. This request flooding wastes server/network resources and makes the interface flicker or show results for the wrong query.
*/

// A new keystroke resets this timer, so fn runs only after typing pauses.
function debounce(fn, delay) {
  let timer
  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

async function fetchCharacters(nextPage = 1) {
  debouncedFetch.cancel()
  controller?.abort()
  controller = new AbortController()
  const activeController = controller

  page.value = nextPage
  loading.value = true
  error.value = ''
  hasSearched.value = true

  const params = new URLSearchParams({ page: String(nextPage) })
  if (trimmedQuery.value) params.set('name', trimmedQuery.value)

  try {
    const response = await fetch(`${API}?${params}`, { signal: activeController.signal })
    if (response.status === 404) {
      characters.value = []
      total.value = 0
      pages.value = 1
      return
    }
    if (!response.ok) throw new Error('The character archive could not be reached.')

    const data = await response.json()
    characters.value = data.results
    total.value = data.info.count
    pages.value = data.info.pages
  } catch (err) {
    if (err.name === 'AbortError') return
    characters.value = []
    total.value = 0
    error.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    if (controller === activeController) loading.value = false
  }
}

const debouncedFetch = debounce(() => fetchCharacters(1), 400)

function onSearchInput() {
  page.value = 1
  debouncedFetch.cancel()
  // Cancel an active fetch immediately; the replacement request waits for the debounce.
  controller?.abort()
  loading.value = true
  debouncedFetch()
}

function changePage(nextPage) {
  if (nextPage < 1 || nextPage > pages.value || loading.value) return
  fetchCharacters(nextPage)
  characterList.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => fetchCharacters(1))
onBeforeUnmount(() => {
  debouncedFetch.cancel()
  controller?.abort()
})
</script>

<template>
  <main class="page-shell">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <header class="topbar">
      <a class="brand" href="#top" aria-label="Dimension Index home">
        <span class="brand-mark">D<span>·</span>I</span>
        <span class="brand-name">DIMENSION<br />INDEX</span>
      </a>
      <div class="topbar-note"><span class="live-dot"></span> FIELD GUIDE <span class="topbar-divider">/</span> EARTH C-137</div>
    </header>

    <section id="top" class="hero">
      <div class="eyebrow"><span class="eyebrow-line"></span> THE MULTIVERSE, CATALOGUED</div>
      <h1>Find your<br /><span>character.</span></h1>
      <p class="intro">A field guide to the strange, familiar, and somewhere-in-between.<br class="desktop-break" /> Search the known dimensions by name.</p>

      <div class="search-row">
        <SearchBar v-model="query" @input="onSearchInput" />
        <div class="search-status"><span class="pulse-dot"></span> LIVE DATABASE</div>
      </div>
      <div class="search-meta" aria-live="polite">
        <span v-if="loading" class="status-text"><span class="mini-spinner"></span> Scanning dimensions…</span>
        <span v-else-if="error" class="status-text error-text">{{ error }}</span>
        <span v-else-if="hasSearched && total" class="status-text">{{ total.toLocaleString() }} {{ total === 1 ? 'character' : 'characters' }} found</span>
        <span v-else-if="hasSearched && !total" class="status-text">No matching signals</span>
        <span class="meta-right">{{ trimmedQuery ? `QUERY: “${trimmedQuery}”` : 'ALL KNOWN RESIDENTS' }}</span>
      </div>
    </section>

    <section class="results-section" aria-label="Character results">
      <div class="section-heading">
        <div><span class="section-index">01</span><h2>Known residents</h2></div>
        <span class="result-range" v-if="total">{{ String(rangeStart).padStart(2, '0') }}—{{ String(rangeEnd).padStart(2, '0') }} <span>/ {{ String(total).padStart(2, '0') }}</span></span>
      </div>

      <div v-if="loading && !characters.length" class="loading-grid" aria-label="Loading characters">
        <div v-for="n in 8" :key="n" class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-line"></div><div class="skeleton-short"></div></div>
      </div>

      <div v-else-if="error" class="empty-state"><span class="empty-symbol">!</span><h3>Signal lost</h3><p>{{ error }}</p></div>
      <div v-else-if="!loading && !characters.length" class="empty-state"><span class="empty-symbol">∅</span><h3>No characters found</h3><p>Nothing in the archive matches “{{ trimmedQuery }}”. Try another name.</p></div>

      <div v-else ref="characterList" class="character-grid" :class="{ 'is-refreshing': loading }">
        <article v-for="(character, index) in characters" :key="character.id" class="character-card" :style="{ '--card-index': index }">
          <div class="portrait-wrap">
            <img :src="character.image" :alt="character.name" loading="lazy" />
            <span class="card-number">{{ String(character.id).padStart(3, '0') }}</span>
            <span class="status-pill" :class="character.status.toLowerCase()"><i></i>{{ character.status }}</span>
          </div>
          <div class="card-info">
            <div class="card-species">{{ character.species }}<span v-if="character.type"> · {{ character.type }}</span></div>
            <h3>{{ character.name }}</h3>
            <div class="card-location"><span class="location-icon">⌖</span><span>{{ character.location.name }}</span></div>
          </div>
          <div class="card-arrow" aria-hidden="true">↗</div>
        </article>
      </div>

      <PaginationBar
        v-if="pages > 1 && characters.length"
        :current-page="page"
        :total-pages="pages"
        @page-change="changePage"
      />
    </section>

    <footer class="footer"><span>DIMENSION INDEX <span class="footer-dot">·</span> A FIELD GUIDE TO THE MULTIVERSE</span><span>DATA VIA RICK AND MORTY API</span></footer>
  </main>
</template>
