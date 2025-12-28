<script setup lang="ts">
  import siteMeta from '@/site'
  const { title, logo } = siteMeta
</script>
<template>
  <ULink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
    <NuxtImg src="logo.webp" alt="Logo" />
  </ULink>
</template>
<style scoped></style>
