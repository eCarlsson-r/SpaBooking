<script setup lang="ts">
  // 1. Import your auth store
  const auth = useAuthStore();

  // 2. (Optional but recommended) If you need to keep properties reactive 
  // when destructuring, use storeToRefs
  const { user } = storeToRefs(auth)
  // 3. Initialize your booking store too since we used it in the UI
  const bookingStore = useBookingStore();

  definePageMeta({
    // layout: 'default',
    // name: 'index',
    // alias: 'index',
    title: 'Home',
    description: 'New Arrivals, Big Savings!',
    navOrder: 1,
    type: 'primary',
    icon: 'i-mdi-home',
    // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
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

    <div v-if="user" class="appointment-form p-4 bg-white rounded-xl shadow-lg -mt-10 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="cursor-pointer border p-3 rounded-lg flex justify-between" @click="bookingStore.openWithStep('date')">
          <span class="text-slate-500">{{ bookingStore.selection.session_date || 'Select date' }}</span>
          <UIcon name="i-mdi-calendar" class="w-5 h-5" />
        </div>

        <div class="cursor-pointer border p-3 rounded-lg flex justify-between" @click="bookingStore.openWithStep('treatment')">
          <span class="text-slate-500">{{ bookingStore.selection.treatment?.name || 'Select treatment' }}</span>
          <UIcon name="i-mdi-chevron-down" class="w-5 h-5" />
        </div>
      </div>

      <button class="lemon-btn w-full mt-4" @click="bookingStore.openWithStep('confirm')">
        Book Now <i class="fa fa-angle-double-right"/>
      </button>
    </div>
    
    <PriceList :categories="categories" :user="user" />
    <HeroFooter :categories="categories" />
  </div>
</template>
<style scoped></style>
