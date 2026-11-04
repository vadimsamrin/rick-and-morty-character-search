<script setup>
defineProps({ modelValue: { type: String, required: true } })
const emit = defineEmits(['update:modelValue', 'input'])

function onInput(event) {
  emit('update:modelValue', event.target.value)
  emit('input', event.target.value)
}
</script>

<template>
  <label class="search-field">
    <span class="sr-only">Search characters by name</span>
    <input :value="modelValue" type="search" placeholder="Try Morty or Summer…" @input="onInput" />
  </label>
</template>
