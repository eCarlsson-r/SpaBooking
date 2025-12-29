<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Our Treatment Categories</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="cat in categories" 
        :key="cat.id" 
        :to="`/treatments/${cat.id}`"
        class="border rounded-lg p-4 hover:shadow-lg transition"
      >
        <img :src="`${$config.public.serverURL}${cat.header_img}`" class="rounded mb-2" >
        <h4 class="font-bold">{{ cat.name }}</h4>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const { data: categories } = await useAsyncData('categories', () => $api('/category'));
</script>