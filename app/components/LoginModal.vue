<script setup>
  import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
  import { Label } from '@/components/ui/label'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
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
      }
    } catch (error) {
      console.error("Login failed", error)
    }
  }
</script>

<template>
  <Dialog :open="ui.isLoginModalOpen" @update:open="ui.closeLogin">
    <DialogContent class="sm:max-w-[400px] rounded-3xl p-8 bg-slate-50">
      <DialogHeader>
        <DialogTitle class="text-2xl font-black text-slate-800">Sign In</DialogTitle>
        <DialogDescription>Please enter your email and password to sign in.</DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label>Email</Label>
          <Input v-model="credentials.username" type="email" placeholder="nama@email.com" />
        </div>
        <div class="space-y-2">
          <Label>Password</Label>
          <Input v-model="credentials.password" type="password" />
        </div>
      </div>

      <DialogFooter class="flex flex-col gap-3">
        <Button class="w-full bg-[#8A8A00] hover:bg-[#6A6A00] h-12" @click="handleLogin">
          Sign In
        </Button>
        <p class="text-sm text-center">
          Don't have an account? 
          <NuxtLink to="/register" class="text-blue-600 font-bold" @click="ui.closeLogin">Register Now</NuxtLink>
        </p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>