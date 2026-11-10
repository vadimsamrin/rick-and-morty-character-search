<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['page-change'])

const pageItems = computed(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)
  const items = [1]

  if (start > 2) items.push('start-ellipsis')
  else start = 2

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < total - 1) items.push('end-ellipsis')
  else end = total - 1

  items.push(total)
  return items
})

function selectPage(page) {
  if (page === props.currentPage || page < 1 || page > props.totalPages) return
  emit('page-change', page)
}
</script>

<template>
  <nav class="pagination" aria-label="Character pages">
    <button
      class="page-button page-prev"
      type="button"
      :disabled="currentPage <= 1"
      aria-label="Previous page"
      @click="selectPage(currentPage - 1)"
    >
      ← <span>PREVIOUS</span>
    </button>

    <div class="page-numbers" aria-label="Page numbers">
      <template v-for="item in pageItems" :key="item">
        <span v-if="typeof item === 'string'" class="page-ellipsis" aria-hidden="true">…</span>
        <button
          v-else
          class="page-button page-number"
          :class="{ 'is-active': item === currentPage }"
          type="button"
          :aria-label="`Page ${item}`"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click="selectPage(item)"
        >
          {{ item }}
        </button>
      </template>
    </div>

    <button
      class="page-button page-next"
      type="button"
      :disabled="currentPage >= totalPages"
      aria-label="Next page"
      @click="selectPage(currentPage + 1)"
    >
      <span>NEXT</span> →
    </button>
  </nav>
</template>
