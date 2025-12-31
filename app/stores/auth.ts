export const useAuthStore = defineStore('auth', () => {
   const user = ref(null)
   const token = useCookie('auth_token')
   const isLoggedIn = computed(() => !!token.value)
   const { $api } = useNuxtApp();

   const bookingStore = useBookingStore()

   const login = async (credentials) => {
      // 1. Remove 'const' from here to use the ref defined above
      const response: any = await $api('/login', { method: 'POST', body: credentials });
      // 2. Update the store state
      user.value = response.data;
      // 3. If your API provides a token, save it to the cookie
      if (response.token) {
         token.value = response.token
      }
      // 4. Set the customer ID for the booking process
      if (response.data?.customer?.id) {
         bookingStore.setCustomer(response.data.customer.id);
      }

      return response
   }

   const logout = async () => {
      user.value = null
      token.value = null
      await $api('/logout')
      navigateTo('/')
   }

   // Fetch user profile if token exists but user is null
   const fetchUser = async () => {
      if (token.value && !user.value) {
         try {
            const res: any = await $api('/user') // Your Laravel endpoint for Auth::user()
            user.value = res.data
            console.info(res);
         } catch (e) {
            token.value = null // Token invalid
         }
      }
   }

   return { user, isLoggedIn, token, login, logout, fetchUser }
})