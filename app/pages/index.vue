<script setup lang="ts">
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
  const { data: categories, error } = await useAsyncData('category', () => 
    $api('/category')
  );

  if (error.value) {
    console.info(error);
    // Handle error (e.g., show a fallback banner)
  }
</script>
<template>
  <div>
    <HeroSection />
    <PriceList :categories="categories" />
    <HeroFooter :categories="categories" />
  </div>
</template>
<style scoped></style>
