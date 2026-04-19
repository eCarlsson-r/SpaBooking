<script setup lang="ts">
const config = useRuntimeConfig()
const props = defineProps({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  header_img: { type: String, default: '' }
})
</script>
<template>
  <NuxtLink
    class="m-4 relative w-full"
    :to="`/treatments/${id}`"
    >
    <UCard class="md:h-full">
      <NuxtImg class="max-h-full" :src="header_img ? `${config.public.serverURL}${header_img}` : '//placehold.co/600x400'" height="250" />
      <div>
        <h5>{{ name }}</h5>
        <p>{{ description }}</p>
      </div>
    </UCard>
  </NuxtLink>
</template>
<style scoped></style>
