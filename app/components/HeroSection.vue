<script setup lang="ts">
const { $api } = useNuxtApp();
const { data: banners, error } = await useAsyncData<any[]>(
  'banner',
  () => $api('/banner'),
  { default: () => [] }
)

if (error.value) {
  // Handle error (e.g., show a fallback banner)
}
const localePath = useLocalePath()
</script>
<template>
  <div class="relative w-full overflow-hidden shadow-lg group">
    <UCarousel
      v-slot="{ item }"
      :items="banners ?? []"
      :ui="{ item: 'basis-full' }"
      class="rounded-lg overflow-hidden"
      indicators
      arrows
    >
      <div class="relative w-full h-[calc(100dvh-72px)] sm:h-auto sm:aspect-[2/1] md:aspect-[5/2]">
        <img :src="`${$config.public.serverURL}${item.image}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          
          <div class="px-6 sm:px-8 md:px-16 w-full text-center text-white space-y-4 sm:space-y-4">
            <h4 class="text-sm sm:text-base md:text-xl font-medium text-lime-400">
              {{ item.introduction }}
            </h4>
            <h2 class="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              {{ item.title }}
            </h2>
            <h3 class="text-xl sm:text-3xl md:text-4xl font-semibold opacity-90">
              {{ item.subtitle }}
            </h3>
            <p class="text-lg text-gray-200 line-clamp-3 sm:line-clamp-2">
              {{ item.description }}
            </p>
            <div class="pt-4 sm:pt-4">
              <UButton
                :to="localePath(item.action_page)"
                size="xl"
                color="primary"
                class="px-8 sm:px-8 font-bold shadow-lg transition-transform hover:scale-105"
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
