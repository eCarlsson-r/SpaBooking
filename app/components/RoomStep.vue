<script setup>
const bookingStore = useBookingStore()
const { $api } = useNuxtApp()

// Fetch available rooms based on previous selections
const { data: rooms, refresh: refreshRooms } = await useAsyncData('rooms', () => 
  $api('/room', {
    params: {
      show: 'empty',
      branch_id: bookingStore.selection.branch_id,
      date: bookingStore.selection.session_date,
      time: bookingStore.selection.session_time,
      duration: bookingStore.selection.treatment?.duration
    }
  })
)

// Just pass the map of types to their refresh functions
useRealtimeSync({ 'rooms': refreshRooms })

const selectRoom = (room) => {
  bookingStore.selection.room_id = room.id
  bookingStore.selection.room = room
  bookingStore.currentStep = 'staff' // Now proceed to Therapist
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-sm font-bold text-slate-500 uppercase">Pilih Kamar / Bed</h3>
    
    <div v-if="pending" class="grid grid-cols-3 gap-2 animate-pulse">
       <div v-for="i in 6" :key="i" class="h-12 bg-slate-100 rounded-lg"/>
    </div>

    <div v-else class="grid grid-cols-3 gap-2">
      <button 
        v-for="room in rooms" :key="room.id"
        class="p-3 border rounded-xl text-center text-sm font-bold hover:border-primary-900 bg-white"
        @click="selectRoom(room)"
      >
        {{ room.name }}
      </button>
    </div>
  </div>
</template>