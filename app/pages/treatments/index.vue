<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Our Treatment Categories</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <CategoryCard v-for="cat in categories" :id="cat.id" :key="cat.id" :name="cat.name" :header_img="cat.header_img" :description="cat.description"/>
    </div>
  </div>
</template>

<script setup>
// useAsyncData is preferred over useFetch when using a custom fetcher
const { data: categories, refresh: refreshCategories } = useCategories()

// Just pass the map of types to their refresh functions
useRealtimeSync({
  'category': refreshCategories,
})

definePageMeta({
    // layout: 'default',
    // name: 'index',
    // alias: 'index',
    title: 'Treatment Categories',
    description: 'Explore our relaxing treatments and book your next session.',
    navOrder: 2,
    type: 'primary',
    icon: 'i-tabler-massage'
  })
</script>