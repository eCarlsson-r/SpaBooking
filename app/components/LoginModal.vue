<script setup>
  const { t } = useI18n()
  const ui = useUIStore()
  const auth = useAuthStore()
  const bookingStore = useBookingStore()

  const credentials = reactive({
    username: '',
    password: '',
  })

  const handleLogin = async () => {
    try {
      await auth.login(credentials)
      ui.closeLogin()

      // If they were in the middle of a booking, reopen the drawer
      if (bookingStore.selection.treatment_id) {
        bookingStore.isOpen = true
      } else {
        navigateTo('/profile')
      }
    } catch (error) {
      console.error('Login failed', error)
    }
  }
</script>

<template>
  <UModal
    v-model="ui.isLoginModalOpen"
    class="rounded-3xl sm:max-w-[400px]"
    :ui="{ container: 'items-center' }"
  >
    <UCard class="p-8 bg-slate-50 dark:bg-slate-950">
      <template #header>
        <h2 class="text-2xl font-black text-slate-800 dark:text-slate-50">
          {{ t('auth.signIn') }}
        </h2>
        <p class="text-sm text-gray-500">{{ t('auth.signInSubtitle') }}</p>
      </template>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('auth.email') }}</label>
          <UInput
            v-model="credentials.username"
            type="email"
            :placeholder="t('auth.emailPlaceholder')"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('auth.password') }}</label>
          <UInput v-model="credentials.password" type="password" />
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col gap-3">
          <UButton
            class="w-full h-12 justify-center"
            color="primary"
            @click="handleLogin"
            >{{ t('auth.signIn') }}</UButton
          >
          <p class="text-sm text-center">
            {{ t('auth.noAccount') }}
            <NuxtLink
              to="/register"
              class="text-blue-600 font-bold"
              @click="ui.closeLogin"
              >{{ t('auth.registerNow') }}</NuxtLink
            >
          </p>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
