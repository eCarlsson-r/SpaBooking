<script setup>
const bookingStore = useBookingStore()
const { $api } = useNuxtApp()
const { data: categories, refresh: refreshCategories } = await useAsyncData('category', () => $api('/category'))
useRealtimeSync({ 'category': refreshCategories })

const handleTreatmentSelect = (treatment) => {
  // 1. Save all necessary treatment info
  bookingStore.selection.treatment_id = treatment.id
  bookingStore.selection.treatment = treatment 
  bookingStore.selection.price = treatment.price
  
  // 2. Move to the next logical step (Date)
  // We don't save to database yet because date/time/staff are still null
  bookingStore.currentStep = 'date'
}
</script>

<template>
  <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
    <div v-for="cat in categories" :key="cat.id">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{{ cat.name }}</h3>
      <div class="grid gap-2">
        <button 
          v-for="treatment in cat.treatment" 
          :key="treatment.id"
          class="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-slate-50 active:scale-95 transition-all"
          @click="handleTreatmentSelect(treatment)"
        >
          <div class="text-left">
            <p class="font-bold text-slate-800">{{ treatment.name }}</p>
            <p class="text-xs text-slate-500">{{ treatment.duration }} mins</p>
          </div>
          <p class="font-bold text-blue-600">{{ formatIDR(treatment.price) }}</p>
        </button>
      </div>
    </div>
  </div>
</template>