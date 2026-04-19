<script setup>
const route = useRoute();
const { $api } = useNuxtApp();

definePageMeta({
  navOrder: 3,
  type: 'secondary',
  icon: 'i-tabler-massage'
})

const config = useRuntimeConfig();
const { data: category } = useAsyncData(`category-${route.params.id}`, () => 
  $api(`/category/${route.params.id}`)
);

useSeoMeta({
  title: () => category.value?.name,
  description: () => category.value?.description,
  ogTitle: () => category.value?.name,
  ogDescription: () => category.value?.description
})

const bookingStore = useBookingStore();
const ui = useUIStore();
const { isLoggedIn } = storeToRefs(useAuthStore());

const handleQuickBook = (item) => {
  // 1. Pre-fill the store with this specific treatment
  bookingStore.selection.treatment_id = item.id;
  
  // 2. Open the modal we designed earlier
  ui.isBookingOpen = true;
};
</script>
<template>
  <div v-if="category">
    <div class="relative w-full aspect-[21/12] md:aspect-[5/1]">
      <img :src="category.header_img ? `${config.public.serverURL}${category.header_img}` : '//placehold.co/1280x500'" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
        <div class="px-8 md:px-16 w-full text-center text-white space-y-4">
          <h2 class="text-3xl md:text-5xl font-bold tracking-tight">
            {{ category.name }}
          </h2>
          <p class="text-lg text-gray-200 line-clamp-2">
            {{ category.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-4 sm:px-8 md:px-16">
      <UCard v-for="item in category.treatment" :key="item.id">
        <div class="grid grid-cols-4 gap-2">
          <div v-if="item.image" class="col-span-1">
            <NuxtImg :src="`${config.public.serverURL}${item.image}`" height="250" />
          </div>
          <div v-else class="col-span-1">
            <NuxtImg src="//placehold.co/600x400" height="250" />
          </div>

          <div class="col-span-3">
            <div class="flex justify-between">
              <h5>{{ item.name }}</h5>
              <UButton v-if="isLoggedIn" variant="solid" @click="handleQuickBook(item)">{{ t('cart.bookNow') }}</UButton>
            </div>
            <span v-text="item.description"/>
          </div>
        </div>  
      </UCard>
    </div>

    <div class="grid grid-cols-3">
      <div v-if="category.body_img1" class="relative w-full aspect-[2/1]">
        <img :src="`${config.public.serverURL}${category.body_img1}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      </div>
      <div v-if="category.body_img2" class="relative w-full aspect-[2/1]">
        <img :src="`${config.public.serverURL}${category.body_img2}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      </div>
      <div v-if="category.body_img3" class="relative w-full aspect-[2/1]">
        <img :src="`${config.public.serverURL}${category.body_img3}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      </div>
    </div>
  </div>
</template>