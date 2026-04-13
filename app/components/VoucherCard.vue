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
  const { id, name, price, icon_img, voucher_purchase_quantity, voucher_normal_quantity } = props

  const { isLoggedIn } = useAuthStore()
  const cart = useCartStore()
  const { $api } = useNuxtApp()

  const handleBuyVoucher = async () => {
    try {
      await $api('/cart/voucher', {
        method: 'POST',
        body: {
          treatment_id: id,
          session_type: 'voucher',
          quantity: voucher_normal_quantity,
          price: price,
          voucher_normal_quantity: voucher_normal_quantity,
          voucher_purchase_quantity: voucher_purchase_quantity
        }
      })

      // Refresh the cart store so the badge updates
      await cart.fetchCart()
      
      // Navigate to cart page
      navigateTo('/cart')
    } catch (err) {
      console.error("Failed to add voucher to cart", err)
    }
  }
</script>
<template>
  <UCard class="md:w-full">
    <NuxtImg :src="icon_img ? `${$config.public.serverURL}/${icon_img}` : '//placehold.co/180x180'" height="250" />
    <div>
      <span>{{ name }}</span>
      <div class="flex font-medium items-center justify-between mt-2">
        <span class="font-bold">IDR {{new Intl.NumberFormat('id-ID').format((price*voucher_purchase_quantity)/1000)}}K</span>
        <span class="dark:text-primary-400 text-primary-500 text-xs"><del>
          IDR {{new Intl.NumberFormat('id-ID').format((price*voucher_normal_quantity)/1000)}}K
        </del></span>
      </div>
      <div class="mt-2">
        <button v-if="isLoggedIn" class="bg-primary-500 text-white px-4 py-2 rounded w-full" @click="handleBuyVoucher">Buy</button>
      </div>
    </div>
  </UCard>
</template>
<style scoped></style>
