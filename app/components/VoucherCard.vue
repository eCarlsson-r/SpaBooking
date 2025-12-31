<script setup lang="ts">
  const props = defineProps({
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    icon_img: {
      type: String,
      required: true
    },
    voucher_purchase_quantity: {
      type: Number,
      required: true
    },
    voucher_normal_quantity: {
      type: Number,
      required: true
    }
  })
  const { id, name, description, price, icon_img, voucher_purchase_quantity, voucher_normal_quantity } = props


</script>
<template>
  <UCard class="md:w-full">
    <NuxtImg :src="`${$config.public.serverURL}${icon_img}`" height="250" />
    <div>
      <span>{{ name }}</span>
      <div class="flex font-medium items-center justify-between mt-2">
        <span class="font-bold">IDR {{new Intl.NumberFormat('id-ID').format((price*voucher_purchase_quantity)/1000)}}K</span>
        <span
          class="dark:text-primary-400 text-primary-500 text-xs"
          >IDR {{new Intl.NumberFormat('id-ID').format((price*voucher_normal_quantity)/1000)}}K</span
        >
      </div>
      <div class="mt-2">
        <button class="bg-primary-500 text-white px-4 py-2 rounded w-full">Buy</button>
      </div>
    </div>
  </UCard>
</template>
<style scoped></style>
