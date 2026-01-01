// plugins/auth-init.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  
  // This runs on the client side only when the app boots
  await auth.initAuth()
})