<template>
  <div v-if="category" class="p-8">
    <UButton to="/treatments" icon="i-heroicons-arrow-left" variant="ghost" class="mb-4">
      Back to Categories
    </UButton>

    <div class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/3">
        <img :src="`${$config.public.serverURL}${category.header_img}`" class="rounded-xl shadow-lg" >
      </div>
      
      <div class="flex-1">
        <h1 class="text-4xl font-serif text-[#8B5E1D] mb-2">{{ category.name }}</h1>
        <p class="text-gray-600 mb-8">{{ category.description }}</p>

        <div class="space-y-4">
          <UCard v-for="item in category.treatment" :key="item.id" class="grid grid-cols-3">
            <NuxtImg :src="`${$config.public.serverURL}${item.image}`" height="250" />
            <div class="col-span-2">
              <h5>{{ item.name }}</h5>
              <span>{{ item.description }}</span>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { $api } = useNuxtApp();

// route.params.id matches the [id].vue filename
const { data: category } = await useAsyncData(`category-${route.params.id}`, () => 
  $api(`/category/${route.params.id}`)
);
</script>