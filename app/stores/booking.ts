// stores/booking.ts
export const useBookingStore = defineStore('booking', {
  state: () => ({
    isOpen: false,
    currentStep: 'treatment',
    selection: {
      branch_id: null as number | null,
      branch: null,
      customer_id: null as number | null,
      session_type: 'walkin', 
      session_date: null as string | null,
      session_time: null as string | null,
      employee_id: null as number | null,
      employee: null,
      treatment_id: null as string | null,
      treatment: null,
      room_id: null as number | null,
      room: null,
      price: 0,
      quantity: 1
    }
  }),
  actions: {
    resetSelection() {
      this.selection = {
        branch_id: null as number | null,
        branch: null,
        customer_id: this.selection.customer_id, // Keep the user ID
        session_type: 'walkin',
        session_date: null,
        session_time: null,
        employee_id: null,
        employee: null,
        treatment_id: null,
        treatment: null,
        room_id: null,
        room: null,
        price: 0,
        quantity: 1
      };
      this.currentStep = 'treatment';
    },
    async saveToCart() {
      const { $api } = useNuxtApp()
      
      // Prepare the payload exactly as migration expects
      const payload = {
        customer_id: this.$state.selection.customer_id,
        session_type: this.$state.selection.session_type,
        session_date: this.$state.selection.session_date,
        session_time: this.$state.selection.session_time,
        employee_id: this.$state.selection.employee_id,
        treatment_id: this.$state.selection.treatment_id,
        room_id: this.$state.selection.room_id,
        price: this.$state.selection.price,
        quantity: 1
      }

      try {
        await $api('/cart/session', { method: 'POST', body: payload })
        this.currentStep = 'confirm'
      } catch (e) {
        // Handle error (e.g., therapist already booked for that duration)
      }
    },
    setBranch(branch: { id: number, name: string }) {
      this.selection.branch_id = branch.id
      this.selection.branch = branch
      this.currentStep = 'treatment' // Proceed to next step
    },
    // Call this inside your Login logic or App.vue
    setCustomer(id: number) {
      this.selection.customer_id = id
    },
    
    // Logic to update session type if purchasing voucher
    setVoucherMode() {
      this.selection.session_type = 'voucher'
    },
    
    openWithStep(step: string) {
      this.currentStep = step
      this.isOpen = true
    }
  }
})