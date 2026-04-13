<script setup>
  const ui = useUIStore()
  const auth = useAuthStore()
  const bookingStore = useBookingStore()

  const credentials = reactive({
    username: '',
    password: ''
  })

  const handleLogin = async () => {
    try {
      await auth.login(credentials)
      ui.closeLogin()

      // If they were in the middle of a booking, reopen the drawer
      if (bookingStore.selection.treatment_id) {
        bookingStore.isOpen = true
      } else {
        navigateTo('/profile');
      }
    } catch (error) {
      console.error("Login failed", error)
    }
  }
</script>

<template>
  <UModal v-model="ui.isLoginModalOpen" :ui="{ container: 'items-center' }">
    <UCard class="sm:max-w-[400px] rounded-3xl p-8 bg-slate-50 dark:bg-slate-950">
      <template #header>
        <h2 class="text-2xl font-black text-slate-800 dark:text-slate-50">Sign In</h2>
        <p class="text-sm text-gray-500">Please enter your email and password to sign in.</p>
      </template>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <UInput v-model="credentials.username" type="email" placeholder="nama@email.com" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <UInput v-model="credentials.password" type="password" />
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col gap-3">
          <UButton class="w-full h-12" color="primary" @click="handleLogin">Sign In</UButton>
          <p class="text-sm text-center">
            Don't have an account?
            <NuxtLink to="/register" class="text-blue-600 font-bold" @click="ui.closeLogin">Register Now</NuxtLink>
          </p>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
