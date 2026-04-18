<script setup lang="ts">
  import type { Category } from '~~/types/store'
  const { t } = useI18n()
  const props = defineProps({
    categories: {
      type: Array as PropType<Category[]>,
      required: true
    }
  });
  const localePath = useLocalePath()
</script>
<template>
  <div class="relative py-12 px-6 md:px-12 bg-cover bg-center" style="background-image: url('/footer.webp');">
    <div class="absolute inset-0 bg-yellow-800/70"/>

    <div class="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto text-white">
      <div>
        <h4 class="text-xs italic text-lime-300">{{ t('hero.aboutUsSubtitle') }}</h4>
        <h3 class="text-xl font-bold mb-4 uppercase">{{ t('hero.aboutUs') }}</h3>
        <p class="text-sm opacity-80">{{ t('hero.aboutUsDescription') }}</p>
      </div>

      <div>
        <h4 class="text-xs italic text-lime-300">{{ t('hero.operationalHoursSubtitle') }}</h4>
        <h3 class="text-xl font-bold mb-4 uppercase">{{ t('hero.operationalHours') }}</h3>
        <p class="text-sm">{{ t('hero.operationalHoursValue') }}</p>
      </div>

      <div>
        <h4 class="text-xs italic text-lime-300">{{ t('hero.servicesSubtitle') }}</h4>
        <h3 class="text-xl font-bold mb-4 uppercase">{{ t('hero.services') }}</h3>
        <ul class="text-sm space-y-2">
          <li v-for="cat in props.categories" :key="cat.id" class="hover:text-lime-300 cursor-pointer">
            <NuxtLink :to="localePath('/treatments/' + cat.id)">▶ {{ cat.name }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
