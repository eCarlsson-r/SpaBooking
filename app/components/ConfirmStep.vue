<script setup>
const bookingStore = useBookingStore()
const { selection } = bookingStore

const finalizeAndGoToPayment = () => {
  bookingStore.isOpen = false
  navigateTo('/checkout/summary') 
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
        <UIcon name="i-mdi-check" class="w-8 h-8" />
      </div>
      <h2 class="text-lg font-bold">Order Saved</h2>
      <p class="text-xs text-slate-500">Therapist and room are ready for you.</p>
    </div>

    <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-xs text-slate-500 uppercase">Treatment</span>
        <span class="font-bold text-sm">{{ selection.treatment?.name }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-xs text-slate-500 uppercase">Time</span>
        <span class="font-bold text-sm">{{ selection.session_date }} @ {{ selection.session_time }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-xs text-slate-500 uppercase">Therapist / Room</span>
        <span class="font-bold text-sm">{{ selection.employee?.name }} ({{ selection.room?.name }})</span>
      </div>
      <div class="border-t pt-3 flex justify-between items-center">
        <span class="font-bold">Total</span>
        <span class="text-xl font-black text-blue-600">{{ formatIDR(selection.price) }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <button class="w-full h-12 text-lg" @click="finalizeAndGoToPayment">
        Proceed to Payment
      </button>
      <button class="text-sm text-slate-400 py-2" @click="bookingStore.isOpen = false">
        Back to Home
      </button>
    </div>
  </div>
</template>