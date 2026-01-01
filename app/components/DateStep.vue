<script setup>
import { format, addDays, isSameDay, parse, addMinutes, isBefore } from 'date-fns'
import { id } from 'date-fns/locale'

const bookingStore = useBookingStore()

// 1. Generate 14 days for the scroller
const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

// 2. Generate Time Slots based on Treatment Duration
const timeSlots = computed(() => {
  const slots = []
  const duration = bookingStore.selection.treatment?.duration || 60
  let current = parse('09:00', 'HH:mm', new Date()) // Opening
  const end = parse('21:00', 'HH:mm', new Date())    // Closing

  // We allow starting a session every 30 mins as long as it fits before closing
  while (isBefore(addMinutes(current, duration), addMinutes(end, 1))) {
    slots.push(format(current, 'HH:mm'))
    current = addMinutes(current, 30)
  }
  return slots
})

const selectDate = (date) => {
  bookingStore.selection.session_date = format(date, 'yyyy-MM-dd')
}

const selectTime = (time) => {
  bookingStore.selection.session_time = time
  // Move to the newly created Room selection step
  bookingStore.currentStep = 'room'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-xs font-bold text-slate-400 uppercase mb-3">Pilih Tanggal</h3>
      <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button 
          v-for="day in days" :key="day.toString()"
          :class="[
            'flex-shrink-0 w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all',
            bookingStore.selection.session_date === format(day, 'yyyy-MM-dd') 
              ? 'bg-primary-900 border-primary-900 text-white shadow-lg' 
              : 'bg-white text-slate-600 border-slate-100'
          ]"
          @click="selectDate(day)"
        >
          <span class="text-[10px] uppercase font-bold">{{ format(day, 'EEE', { locale: id }) }}</span>
          <span class="text-lg font-black">{{ format(day, 'd') }}</span>
        </button>
      </div>
    </div>

    <div v-if="bookingStore.selection.session_date">
      <h3 class="text-xs font-bold text-slate-400 uppercase mb-3 text-center">Pilih Jam Kedatangan</h3>
      <div class="grid grid-cols-4 gap-2">
        <button 
          v-for="time in timeSlots" :key="time"
          :class="[
            'py-3 rounded-xl border text-sm font-bold transition-all',
            bookingStore.selection.session_time === time 
              ? 'bg-primary-900 border-primary-900 text-white' 
              : 'bg-slate-50 border-transparent text-slate-600'
          ]"
          @click="selectTime(time)"
        >
          {{ time }}
        </button>
      </div>
    </div>
  </div>
</template>