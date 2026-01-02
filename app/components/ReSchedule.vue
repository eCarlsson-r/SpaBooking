<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md rounded-t-[3rem] p-8 animate-slide-up">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-black italic text-[#8B6E1C]">Reschedule</h2>
        <button class="text-slate-300" @click="$emit('close')">✕</button>
      </div>

      <div class="mb-6">
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select New Date</p>
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            v-for="date in nextSevenDays" 
            :key="date.full"
            :class="selectedDate === date.full ? 'bg-[#B6CE00] text-white' : 'bg-slate-50 text-slate-600'"
            class="flex flex-col items-center min-w-[60px] py-4 rounded-2xl transition-all"
            @click="selectedDate = date.full"
          >
            <span class="text-[10px] font-bold uppercase">{{ date.weekday }}</span>
            <span class="text-lg font-black">{{ date.day }}</span>
          </button>
        </div>
      </div>

      <div class="mb-8">
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select New Time</p>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="slot in timeSlots" 
            :key="slot"
            :class="selectedTime === slot ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'"
            class="py-3 rounded-xl text-xs font-bold"
            @click="selectedTime = slot"
          >
            {{ slot }}
          </button>
        </div>
      </div>

      <button 
        :disabled="!selectedDate || !selectedTime"
        class="w-full py-4 bg-[#8B6E1C] disabled:bg-slate-200 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#8B6E1C]/20"
        @click="updateAppointment"
      >
        Confirm Changes
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['isOpen', 'bookingId'])
const emit = defineEmits(['close', 'updated'])

const selectedDate = ref('')
const selectedTime = ref('')

const nextSevenDays = computed(() => {
  // Logic to generate next 7 days based on current date
  return Array.from({length: 7}, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      weekday: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      day: d.getDate(),
      full: d.toISOString().split('T')[0]
    }
  })
})

const timeSlots = ['10:00', '11:00', '13:00', '14:00', '15:00', '17:00', '19:00', '20:00']

const updateAppointment = async () => {
  // Call API to update the booking_date and booking_time in Laravel
  try {
    // await $api(`/bookings/${props.bookingId}/reschedule`, { ... })
    emit('updated')
    emit('close')
  } catch (e) {
    alert("Gagal mengubah jadwal.")
  }
}
</script>