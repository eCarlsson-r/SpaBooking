<script setup lang="ts">
  import type { Category } from '~~/types/store'
  import type { PropType } from 'vue'
  const props = defineProps({
    categories: {
      type: Array as PropType<Category[]>,
      default: () => []
    }
  })
  const selectedCategory = ref(1)
  const currentCategoryData = computed(() => {
    return props.categories?.find((c: Category) => c.id === selectedCategory.value) ?? null;
  })
  const { isLoggedIn } = useAuthStore();
</script>
<template>
  <div v-if="currentCategoryData" class="flex flex-col min-h-[500px] overflow-hidden bg-white shadow-xl">
    <!-- Category Selection -->
    <div class="w-full bg-yellow-900 flex sm:flex-col overflow-x-auto sm:overflow-x-visible no-scrollbar sm:w-16 md:w-20">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="relative flex-shrink-0 h-16 sm:h-32 px-6 sm:px-0 flex items-center justify-center transition-colors border-b-2 sm:border-b-0 sm:border-r-2"
        :class="selectedCategory === cat.id ? 'bg-yellow-800 text-lime-300 border-lime-300' : 'text-white border-transparent hover:bg-yellow-800'"
        @click="selectedCategory = cat.id"
      >
        <span class="sm:rotate-[-90deg] whitespace-nowrap text-sm font-bold uppercase tracking-widest">
          {{ cat.name }}
        </span>
      </button>
    </div>

    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Image only on Desktop -->
      <div class="hidden md:block w-1/2 relative overflow-hidden">
        <img 
          :src="currentCategoryData.header_img ? `${$config.public.serverURL}${currentCategoryData.header_img}` : 'price-tabs.webp'"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          alt="Category Image"
        >
      </div>

      <div class="flex-1 p-6 sm:p-8 bg-stone-50 dark:bg-stone-950">
        <div class="flex justify-between items-center mb-6 border-b pb-2">
          <h2 class="text-2xl font-serif text-yellow-900 dark:text-primary-500">
            {{ currentCategoryData.name }}
          </h2>
          <span class="text-xs text-stone-400 uppercase tracking-widest">Price List</span>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="service in currentCategoryData.treatment" 
            :key="service.id"
            class="flex justify-between items-center border-b border-dotted border-gray-300 pb-3 group hover:bg-white dark:hover:bg-white/5 p-2 rounded transition-colors"
          >
            <div class="flex-1 pr-4">
              <p class="font-bold text-gray-800 dark:text-gray-100 group-hover:text-yellow-900 dark:group-hover:text-primary-400 transition-colors">{{ service.name }}</p>
              <p class="text-xs text-gray-500 italic">{{ service.duration }} mins</p>
            </div>
            <div class="text-right">
              <div v-if="isLoggedIn" class="text-yellow-900 font-bold dark:text-primary-500">
                Rp {{ new Intl.NumberFormat('id-ID').format(service.price) }}
              </div>
              <div v-else class="text-yellow-600 text-xs font-semibold uppercase tracking-tighter">
                Contact for Price
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
