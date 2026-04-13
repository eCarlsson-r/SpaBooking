<script setup>
const route = useRoute();
const { $api } = useNuxtApp();

definePageMeta({
  // layout: 'default',
  // name: 'index',
  // alias: 'index',
  navOrder: 3,
  type: 'secondary',
  icon: 'i-tabler-massage'
})

// route.params.id matches the [id].vue filename
const { data: category } = await useAsyncData(`category-${route.params.id}`, () => 
  $api(`/category/${route.params.id}`)
);

useSeoMeta({
  title: category.value.name,
  description: category.value.description,
  ogTitle: category.value.name,
  ogDescription: category.value.description
})

const props = defineProps(['treatment']);
const bookingStore = useBookingStore();
const ui = useUIStore();
const { isLoggedIn } = storeToRefs(useAuthStore());

const handleQuickBook = () => {
  // 1. Pre-fill the store with this specific treatment
  bookingStore.selection.treatment_id = props.treatment.id;
  
  // 2. Open the modal we designed earlier
  ui.isBookingOpen = true;
};
</script>
<template>
  <div v-if="category">
    <div class="relative w-full aspect-[21/12] md:aspect-[5/1]">
      <img :src="`${$config.public.serverURL}/${category.header_img}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
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

    <div class="space-y-4 p-8">
      <UCard v-for="item in category.treatment" :key="item.id">
        <div class="grid grid-cols-4">
          <div>
            <NuxtImg :src="`${$config.public.serverURL}/${item.image}`" height="250" />
          </div>
          
          <div class="col-span-3">
            <div class="flex justify-between">
              <h5>{{ item.name }}</h5>
              <Button v-if="isLoggedIn" @click="handleQuickBook(item)">Book Now</Button>
            </div>
            <span v-html="item.description"/>
          </div>
        </div>  
      </UCard>
    </div>

    <div class="grid grid-cols-3">
      <div class="relative w-full aspect-[2/1]">
        <img :src="`${$config.public.serverURL}/${category.body_img1}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      </div>
      <div class="relative w-full aspect-[2/1]">
        <img :src="`${$config.public.serverURL}/${category.body_img2}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      </div>
      <div class="relative w-full aspect-[2/1]">
        <img :src="`${$config.public.serverURL}/${category.body_img3}`" class="absolute inset-0 w-full h-full object-cover" draggable="false" >
      </div>
    </div>
  </div>
</template>