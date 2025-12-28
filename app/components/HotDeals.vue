<script setup lang="ts">
  const { $api } = useNuxtApp();

  // useAsyncData is preferred over useFetch when using a custom fetcher
  const { data: categories, error } = await useAsyncData('category', () => 
    $api('/category')
  );

  if (error.value) {
    // Handle error (e.g., show a fallback banner)
  }
</script>
<template>
  <div>
    <UContainer class="py-8">
      <div
        class="-tracking-wide flex font-bold items-center justify-center text-5xl"
      >
        <span class="text-center text-primary">Hot Deals</span>
        <UIcon name="i-twemoji-fire" class="ml-2" width="28px" />
      </div>
      <section
        data-pg-name="Products"
        class="flex flex-wrap justify-center mt-8"
      >
        <ProductCard
          v-for="(product, index) in productsWithBadges"
          :key="index"
          v-bind="product"
        />
      </section>
    </UContainer>
  </div>
</template>
<style scoped></style>
