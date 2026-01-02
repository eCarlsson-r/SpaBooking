<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Our Treatment Vouchers</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <VoucherCard
        v-for="treatment in treatments" 
        :id="treatment.id" 
        :key="treatment.id" 
        :name="treatment.name" 
        :description="treatment.description" 
        :price="treatment.price" 
        :icon_img="treatment.icon_img" 
        :voucher_purchase_quantity="treatment.voucher_purchase_quantity" 
        :voucher_normal_quantity="treatment.voucher_normal_quantity"
      />
    </div>
  </div>
</template>

<script setup>
  const { $api } = useNuxtApp();
  // useAsyncData is preferred over useFetch when using a custom fetcher
  const { data: treatments, refresh: refreshTreatments } = await useAsyncData('treatment', () => $api('/treatment?vouchers=true'))

  // Just pass the map of types to their refresh functions
  useRealtimeSync({
    'treatment': refreshTreatments,
  })

  definePageMeta({
    // layout: 'default',
    // name: 'index',
    // alias: 'index',
    title: 'Voucher Catalog',
    description: 'Explore and purchase vouchers for more economic treatments.',
    navOrder: 2,
    type: 'primary',
    icon: 'i-mdi-catalog'
  })
</script>