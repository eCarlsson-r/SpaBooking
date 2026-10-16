<script setup lang="ts">
const { $api } = useNuxtApp()
const route = useRoute()
const { data: items, refresh } = await useAsyncData('cart', () => $api<any[]>('/cart'))
const pendingId = ref<number | null>(null)
const errorMessage = ref('')
const paymentStatus = ref('')
const total = computed(() => items.value?.reduce((sum, item) => sum + Number(item.price || 0), 0) || 0)

const removeItem = async (id: number) => {
  await $api(`/cart/${id}`, { method: 'DELETE' })
  await refresh()
}

const pay = async (id: number) => {
  pendingId.value = id
  errorMessage.value = ''
  try {
    const result = await $api<{ payment_link_url: string }>('/booking-payments', { method: 'POST', body: { cart_id: id } })
    window.location.assign(result.payment_link_url)
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Could not start payment. Please try again.'
  } finally {
    pendingId.value = null
  }
}

if (route.query.booking_payment_id) {
  const id = Number(route.query.booking_payment_id)
  const poll = async () => {
    try {
      const status = await $api<{ status: string }>(`/booking-payments/${id}`)
      paymentStatus.value = status.status
      if (status.status === 'paid') await refresh()
    } catch {
      paymentStatus.value = 'unavailable'
    }
  }
  await poll()
  if (paymentStatus.value === 'pending') {
    const timer = setInterval(async () => {
      await poll()
      if (paymentStatus.value !== 'pending') clearInterval(timer)
    }, 3000)
    onBeforeUnmount(() => clearInterval(timer))
  }
}
</script>

<template>
  <div class="p-4 pb-32">
    <h1 class="text-2xl font-black mb-6">Order Summary</h1>
    <div v-if="route.query.booking_payment_id" class="mb-4 rounded-xl bg-blue-50 p-4 text-sm" role="status">
      <span v-if="paymentStatus === 'paid'">Payment confirmed. Your appointment is booked.</span>
      <span v-else-if="paymentStatus === 'refund_required'">Payment was received, but the appointment needs staff review. Please contact the spa and do not pay again.</span>
      <span v-else-if="paymentStatus === 'pending'">Waiting for payment confirmation…</span>
      <span v-else-if="paymentStatus === 'expired' || route.query.payment === 'cancelled'">Payment was not completed. You can try again below.</span>
      <span v-else-if="paymentStatus === 'unavailable'">Could not verify payment status. Refresh this page in a moment.</span>
      <span v-else>Checking payment…</span>
    </div>

    <p v-if="errorMessage" class="mb-4 text-sm text-red-600" role="alert">{{ errorMessage }}</p>
    <div v-if="items?.length" class="space-y-4">
      <div v-for="item in items" :key="item.id" class="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between gap-4">
        <div>
          <h3 class="font-bold text-slate-800">{{ item.treatment?.name || `Treatment ${item.treatment_id}` }}</h3>
          <p class="text-xs text-slate-500">{{ item.session_date }} @ {{ item.session_time }}</p>
          <p class="text-xs text-blue-600 font-medium">Therapist: {{ item.employee?.name || item.employee_id }} · Room: {{ item.room?.name || item.room_id }}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="font-bold">{{ formatIDR(item.price) }}</p>
          <button class="text-red-500 text-xs mt-2" @click="removeItem(item.id)">Remove</button>
          <UButton class="mt-3 block" :loading="pendingId === item.id" :disabled="pendingId !== null || ['paid', 'refund_required'].includes(paymentStatus)" @click="pay(item.id)">Pay Now</UButton>
        </div>
      </div>
    </div>
    <p v-else class="text-slate-500">Your cart is empty.</p>
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t pb-8">
      <div class="flex justify-between items-center">
        <span class="text-slate-500">Cart total</span>
        <span class="text-xl font-black text-blue-600">{{ formatIDR(total) }}</span>
      </div>
    </div>
  </div>
</template>
