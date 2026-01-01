<script setup>
const cartStore = useCartStore();

// Optional: Formatting for 99+ if the user is a super-shopper
const displayCount = computed(() => {
  return cartStore.cartCount > 99 ? '99+' : cartStore.cartCount;
});
</script>

<template>
  <NuxtLink to="/cart" class="relative p-2 rounded-lg flex items-center justify-center text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950">
    <UIcon name="i-material-symbols-shopping-bag" class="text-2xl" />

    <Transition name="scale">
      <span 
        v-if="cartStore.cartCount > 0"
        class="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-lime-500 text-primary-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
      >
        {{ displayCount }}
      </span>
    </Transition>
  </NuxtLink>
</template>

<style scoped>
.scale-enter-active, .scale-leave-active { transition: all 0.2s ease; }
.scale-enter-from, .scale-leave-to { transform: scale(0); opacity: 0; }
</style>