<script setup>
import { toast } from 'vue-sonner'
const bookingStore = useBookingStore()

const { $api } = useNuxtApp();

// useAsyncData is preferred over useFetch when using a custom fetcher
const { data: therapists, refresh: refreshTherapists } = await useAsyncData(
  'therapists', 
  () => $api('/employee', {
    params: {
      branch_id: bookingStore.selection.branch_id, // Filter by branch!
      date: bookingStore.selection.session_date,
      time: bookingStore.selection.session_time
    }
  })
)

// Just pass the map of types to their refresh functions
useRealtimeSync({ 'therapists': refreshTherapists })

const selectStaff = async (emp) => {
  bookingStore.selection.employee_id = emp.id
  bookingStore.selection.employee = emp
  
  // TRIGGER SYNC TO DATABASE
  try {
    await bookingStore.saveToCart()
    
    // Trigger the Toaster
    toast({
      title: "Success!",
      description: `${bookingStore.selection.treatment.name} added to cart.`,
      variant: "success", // or "default" / "destructive"
    })
  } catch (e) {
    toast({
      title: "Error",
      description: "An error occurred while adding to cart.",
      variant: "destructive",
    })
  }
  
}
</script>

<template>
  <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
    <h4 class="text-xs font-bold uppercase text-slate-400 mb-2">Select therapist</h4>
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="t in therapists" :key="t.id"
          :class="['p-3 border rounded-xl flex flex-col items-center', bookingStore.selection.employee_id == t.id ? 'bg-blue-600 text-white' : 'bg-white']"
          @click="selectStaff(t)"
        >
          <span class="font-bold">{{ t.name }}</span>
        </button>
      </div>
  </div>
</template>