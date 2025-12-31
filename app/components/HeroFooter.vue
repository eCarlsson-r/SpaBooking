<script setup lang="ts">
  import type { Category } from '~~/types/store'
  const props = defineProps({
    categories: {
      type: Object,
      required: true
    }
  });
</script>
<template>
  <div class="relative py-12 px-6 md:px-12 bg-cover bg-center" style="background-image: url('/footer.webp');">
    <div class="absolute inset-0 bg-yellow-800/70"/>

    <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto text-white">
      <div>
        <h4 class="text-xs italic text-lime-300">Brief description about us</h4>
        <h3 class="text-xl font-bold mb-4 uppercase">About Us</h3>
        <p class="text-sm opacity-80">Spa Premier WebApp provides luxury Balinese treatments designed for your ultimate relaxation.</p>
      </div>

      <div>
        <h4 class="text-xs italic text-lime-300">Our operational schedule</h4>
        <h3 class="text-xl font-bold mb-4 uppercase">Operational Hours</h3>
        <p class="text-sm">Monday - Sunday: <span class="text-lime-300">09:00 - 18:00</span></p>
      </div>

      <div>
        <h4 class="text-xs italic text-lime-300">We are providing</h4>
        <h3 class="text-xl font-bold mb-4 uppercase">Services</h3>
        <ul class="text-sm space-y-2">
          <li v-for="cat in props.categories" :key="cat.id" class="hover:text-lime-300 cursor-pointer">
            <a :href="`/treatments/${cat.id}`">▶ {{ cat.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
