<script setup>
const { $api } = useNuxtApp()
const { data: items, refresh } = await useAsyncData('cart', () => $api('/cart'))

const total = computed(() => items.value?.reduce((acc, item) => acc + item.price, 0) || 0)

const removeItem = async (id) => {
  await $api(`/cart/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div class="p-4 pb-32">
    <h1 class="text-2xl font-black mb-6">Order Summary</h1>
    
    <div v-if="items?.length" class="space-y-4">
      <div v-for="item in items" :key="item.id" class="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between">
        <div>
          <h3 class="font-bold text-slate-800">{{ item.treatment_id }}</h3> <p class="text-xs text-slate-500">{{ item.session_date }} @ {{ item.session_time }}</p>
          <p class="text-xs text-blue-600 font-medium">Therapist: {{ item.employee_id }}</p>
        </div>
        <div class="text-right">
          <p class="font-bold">{{ formatIDR(item.price) }}</p>
          <button class="text-red-500 text-xs mt-2" @click="removeItem(item.id)">Remove</button>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t pb-8">
      <div class="flex justify-between items-center mb-4">
        <span class="text-slate-500">Total Amount</span>
        <span class="text-xl font-black text-blue-600">{{ formatIDR(total) }}</span>
      </div>
      <Button class="w-full h-14 text-lg font-bold">Checkout Now</Button>
    </div>
  </div>
</template>