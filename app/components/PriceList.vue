<script setup lang="ts">
  import type { Category } from '~~/types/store'
  const props = defineProps({
    categories: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  })
  const selectedCategory = ref('B')
  const currentCategoryData = computed(() => {
    return props.categories.find((c: Category) => c.id === selectedCategory.value);
  })
</script>
<template>
  <div class="flex min-h-[500px] overflow-hidden bg-white shadow-xl">
    <div class="flex-1 flex flex-col md:flex-row">
      <div class="hidden md:block w-1/2 relative overflow-hidden">
        <img 
          :src="`${$config.public.serverURL}${currentCategoryData.header_img}`"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          alt="Category Image"
        >
      </div>

      <div class="w-16 md:w-20 bg-yellow-900 flex flex-col items-center py-4">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="relative h-32 w-full flex items-center justify-center transition-colors"
          :class="selectedCategory === cat.id ? 'bg-yellow-800 text-lime-300' : 'text-white hover:bg-yellow-800'"
          @click="selectedCategory = cat.id"
        >
          <span class="rotate-[-90deg] whitespace-nowrap text-sm">
            {{ cat.name }}
          </span>
        </button>
      </div>

      <div class="flex-1 p-8 bg-[#F9F9F9]">
        <h2 class="text-2xl text-yellow-900 mb-6 border-b pb-2">
          {{ currentCategoryData.name }}
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="service in currentCategoryData.treatment" 
            :key="service.id"
            class="flex justify-between items-end border-b border-dotted border-gray-300 pb-2 group hover:bg-white p-2 rounded transition-colors"
          >
            <div>
              <p class="font-bold text-gray-800">{{ service.name }}</p>
            </div>
            <div class="text-yellow-900 font-bold">
              {{ (user) ? `Rp. ${new Intl.NumberFormat('id-ID').format(service.price)},-` : 'Ask Price' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
