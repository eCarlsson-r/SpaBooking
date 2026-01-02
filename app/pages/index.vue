<script setup lang="ts">
  // 1. Import your auth store
  const auth = useAuthStore();

  // 2. (Optional but recommended) If you need to keep properties reactive 
  // when destructuring, use storeToRefs
  const { isLoggedIn } = storeToRefs(auth)
  // 3. Initialize your booking store too since we used it in the UI
  const bookingStore = useBookingStore();

  definePageMeta({
    // layout: 'default',
    // name: 'index',
    // alias: 'index',
    title: 'Home',
    description: 'Explore our relaxing treatments and book your next session.',
    navOrder: 1,
    type: 'primary',
    icon: 'i-mdi-home'
  })

  const { $api } = useNuxtApp();

  // useAsyncData is preferred over useFetch when using a custom fetcher
  const { data: categories, refresh: refreshCategories } = await useAsyncData('category', () => $api('/category'))

  // Just pass the map of types to their refresh functions
  useRealtimeSync({
    'category': refreshCategories,
  })
</script>
<template>
  <div>
    <HeroSection />

    <div v-if="isLoggedIn" class="appointment-form p-4 bg-slate-50 dark:bg-slate-950 rounded-xl shadow-lg -mt-10 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="cursor-pointer border p-3 rounded-lg flex justify-between" @click="bookingStore.openWithStep('date')">
          <span class="text-slate-500 dark:text-slate-50">{{ bookingStore.selection.session_date || 'Select date' }}</span>
          <UIcon name="i-mdi-calendar" class="w-5 h-5" />
        </div>

        <div class="cursor-pointer border p-3 rounded-lg flex justify-between" @click="bookingStore.openWithStep('treatment')">
          <span class="text-slate-500 dark:text-slate-50">{{ bookingStore.selection.treatment?.name || 'Select treatment' }}</span>
          <UIcon name="i-material-symbols-chevron-down-rounded" class="w-5 h-5" />
        </div>
      </div>

      <button class="lemon-btn w-full mt-4" @click="bookingStore.openWithStep('confirm')">
        Book Now <UIcon name="i-material-symbols-chevron-right-rounded" class="w-5 h-5" />
      </button>
    </div>
    
    <PriceList :categories="categories" />
    <HeroFooter :categories="categories" />
  </div>
</template>
<style scoped></style>
