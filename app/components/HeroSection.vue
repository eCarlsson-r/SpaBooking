<script setup lang="ts">
const { $api } = useNuxtApp();

// useAsyncData is preferred over useFetch when using a custom fetcher
const { data: banners, error } = await useAsyncData('banner', () => 
  $api('/banner')
);

if (error.value) {
  // Handle error (e.g., show a fallback banner)
}
</script>
<template>
  <div class="relative w-full overflow-hidden rounded-xl shadow-lg group">
    <UCarousel
      v-slot="{ item }"
      :items="banners"
      :ui="{ item: 'basis-full' }"
      class="rounded-lg overflow-hidden"
      indicators
      arrows
    >
      <div class="relative w-full aspect-[21/9] md:aspect-[3/1]">
        <img :src="`${$config.public.serverURL}${item.image}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          
          <div class="px-8 md:px-16 w-full text-center text-white space-y-4">
            <h3 class="text-2xl md:text-4xl font-bold tracking-tight">
              {{ item.introduction }}
            </h3>
            <h2 class="text-3xl md:text-5xl font-bold tracking-tight">
              {{ item.title }}
            </h2>
            <h3 class="text-2xl md:text-3xl font-bold tracking-tight">
              {{ item.subtitle }}
            </h3>
            <p class="text-lg text-gray-200 line-clamp-2">
              {{ item.description }}
            </p>
            <div class="pt-4">
              <UButton
                :to="item.action_page"
                size="xl"
                color="primary"
                class="px-8 font-semibold shadow-lg transition-transform hover:scale-105"
              >
                {{ item.action }}
              </UButton>
            </div>
          </div>

        </div>
      </div>
    </UCarousel>
  </div>
</template>
<style scoped></style>
