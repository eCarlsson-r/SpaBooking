<script setup>
    const cart = useCartStore();
    const auth = useAuthStore();

    // This runs as soon as the user navigates to the cart
    onMounted(() => {
        cart.fetchCart()
    })

    const handleCheckout = async () => {
        if (!auth.isLoggedIn) {
            useUIStore().openLogin();
            return;
        }
        const {$api} = useNuxtApp();
        // Logic to send data to Laravel and get Midtrans/Payment URL
        const response = await $api('/cart', {
            method: 'POST',
            body: { items: cart.items }
        });
        
        if (response.payment_url) {
            window.location.href = response.payment_url;
        }
    }
</script>

<template>
  <div class="max-w-full min-h-screen pb-10">
    <h1 class="text-2xl font-black p-6">Order Cart</h1>

    <div v-if="cart.items.length === 0" class="px-6 text-center">
      <p class="text-slate-400">Your cart is empty.</p>
      <UButton variant="link" @click="navigateTo('/')">Find Treatment</UButton>
    </div>

    <div v-else class="space-y-4">
        <div
            v-for="(item, index) in cart.items" :key="index" 
            class="bg-white border rounded-3xl mx-6 mb-6 p-6 relative shadow-sm"
        >
        <CartRecords
            :item="item" 
            @update-qty="(change) => cart.updateVoucherQty(item, change)"
            @remove="cart.removeItem(item.id)" 
        />
        </div>

        <div class="border-t p-6">
            <div class="w-full">
            <div class="flex justify-between mb-4">
                <span class="text-slate-500 font-medium">Total Payment</span>
                <span class="text-xl font-black text-[#8B6E1C]">{{ formatIDR(cart.totalPrice) }}</span>
            </div>
            <UButton class="w-full h-14 bg-[#B6CE00] hover:bg-[#a3b800] rounded-2xl text-white font-bold text-lg" @click="handleCheckout">
                PAY NOW
            </UButton>
            </div>
        </div>
    </div>
  </div>
</template>