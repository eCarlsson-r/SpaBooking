export const useAuthStore = defineStore('auth', () => {
   const user = ref(null);
   const { $api } = useNuxtApp();

   const token = useCookie('auth_token', {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
   })
   const isLoggedIn = computed(() => !!token.value && !!user.value)

   // Add this action to re-sync the session
   const initAuth = async () => {
      if (token.value && !user.value) {
         try {
            const res = await $api('/user') 
            // Ensure your Laravel /me returns the same structure: { data: { ... } }
            user.value = res 
         } catch (e) {
            // If token is invalid/expired, clear it
            token.value = null
            user.value = null
         }
      }
   }

   const login = async (credentials) => {
      try {
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
            const bookingStore = useBookingStore();
            bookingStore.setCustomer(response.data.customer.id);
         }
         // CLOSE THE MODAL automatically after successful login
         const ui = useUIStore();
         ui.closeLogin();

         return response
      } catch (error) {
         console.error("Login failed", error)
         throw error
      }
   }

   const logout = async () => {
      const { $api } = useNuxtApp()

      try {
         // 1. Notify Laravel to invalidate the token
         await $api('/logout', { method: 'POST' })
      } catch (error) {
         console.error("Backend logout failed, clearing local state anyway.")
      } finally {
         // 2. Clear local state regardless of API success
         user.value = null
         token.value = null
         
         // 3. Reset booking data if needed
         const bookingStore = useBookingStore();
         bookingStore.setCustomer(null)

         // 4. Redirect to home or refresh the page
         navigateTo('/')
      }
   }

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

   const register = async (formData) => {
      const { $api } = useNuxtApp();

      try {
         const res = await $api('/register', {
            method: 'POST',
            body: formData
         });

         // Same structure as login: res.data (user) and res.token
         user.value = res.data;
         token.value = res.token;

         // Sync the cookie for persistence
         const authCookie = useCookie('auth_token');
         authCookie.value = res.token;

         navigateTo('/profile');
         return res;
      } catch (err) {
         console.error("Registration failed:", err.response?._data || err);
         throw err;
      }
   };

   const updateProfile = async (formData) => {
      try {
        // Assuming you have a $api helper or useFetch set up
        const { data } = await $api(`/customer/${formData.id}`, {
          method: 'PUT',
          body: formData
        })
        
        // Update the local state with the new data from Laravel
        user.value.customer = data;
        
        return { success: true }
      } catch (error) {
        console.error('Update failed:', error)
        return { success: false, error }
      }
    }

   return { user, isLoggedIn, token, login, logout, initAuth, fetchUser, register, updateProfile }
})