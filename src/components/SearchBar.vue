<script setup>
defineProps({
  modelValue: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue', 'input'])

function onInput(event) {
  emit('update:modelValue', event.target.value)
  emit('input', event.target.value)
}
</script>

<template>
  <label class="search-field">
    <span class="sr-only">Search characters by name</span>
    <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
    <input
      :value="modelValue"
      type="search"
      autocomplete="off"
      placeholder="Try “Morty” or “Summer”…"
      @input="onInput"
    />
    <kbd class="key-hint">↵</kbd>
  </label>
</template>
