// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isLoading = ref(false)

  // 1. Fetch from database
  const fetchCart = async () => {
    const { $api } = useNuxtApp()
    const auth = useAuthStore()

    if (!auth.token) return

    isLoading.value = true
    try {
      const res = await $api('/cart')
      // If your backend returns { data: [...] }, use res.data
      items.value = res.data || res 
    } catch (err) {
      console.error("Cart sync error:", err)
    } finally {
      isLoading.value = false
    }
  }
  
  const updateVoucherQty = async (item, change) => {
    const { $api } = useNuxtApp()
    try {
      await $api('/cart/voucher', {
        method: 'POST',
        body: {
          "id": item.id,
          "quantity": change, // The increment/decrement value
          "treatment_id": item.treatment_id,
          "session_type": "voucher"
        }
      })
      // Refresh local data after backend update
      await fetchCart()
    } catch (err) {
      console.error("Update quantity failed", err)
    }
  }

  const removeItem = async (cartRecordId) => {
    const { $api } = useNuxtApp()
    try {
      await $api(`/cart/${cartRecordId}`, {
        method: 'DELETE',
      })
      await fetchCart()
    } catch (err) {
      console.error("Removal failed", err)
    }
  }

  // --- ACTIONS END HERE ---

  // 2. Computed totals for the UI
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.session_type === 'voucher' ? (item.price * (item.quantity/item.voucher_normal_quantity) * item.voucher_purchase_quantity) : item.price * item.quantity), 0)
  })

  const cartCount = computed(() => items.value.length)

  // IMPORTANT: Everything you want to use in components must be returned here
  return { 
    items, 
    isLoading, 
    fetchCart, 
    updateVoucherQty, 
    removeItem, 
    totalPrice, 
    cartCount 
  }
})