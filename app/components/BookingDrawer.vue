<script setup>
  import { storeToRefs } from 'pinia'
  const bookingStore = useBookingStore()
  const { isOpen, currentStep } = storeToRefs(bookingStore)

  const steps = ['branch', 'treatment', 'date', 'room', 'staff', 'confirm']

  const canNavigateTo = (step) => {
    const currentIndex = steps.indexOf(bookingStore.currentStep)
    const targetIndex = steps.indexOf(step)
    return targetIndex < currentIndex 
  }

  const goToStep = (step) => {
    if (canNavigateTo(step)) bookingStore.currentStep = step
  }

  const isStepCompleted = (step) => {
    const currentIndex = steps.indexOf(currentStep.value)
    const targetIndex = steps.indexOf(step)
    return currentIndex >= targetIndex
  }
</script>

<template>
  <ClientOnly>
    <USlideover v-model="bookingStore.isOpen" side="bottom" :ui="{ width: 'w-full max-w-full' }">
      <div class="bg-slate-50 dark:bg-slate-950 h-full mx-auto w-full px-4">
        <div class="flex justify-between items-center py-4 border-b mb-4">
           <button
            v-if="bookingStore.currentStep !== 'branch'" 
            @click="goToStep(steps[steps.indexOf(bookingStore.currentStep)-1])">
            <UIcon name="i-material-symbols-chevron-left-rounded" class="w-5 h-5 text-slate-500" />
           </button>
           <span class="font-bold capitalize">{{ $t('booking.steps.' + bookingStore.currentStep) }}</span>
           <button @click="bookingStore.isOpen = false">
            <UIcon name="i-material-symbols-close" class="w-5 h-5 text-slate-300" />
           </button>
        </div>

        <div class="flex gap-2 mb-6">
          <button 
            v-for="step in steps" :key="step"
            :disabled="!canNavigateTo(step)"
            :class="['h-2 flex-1 rounded-full transition-all', 
              bookingStore.currentStep === step ? 'bg-primary-900' : 'bg-slate-100']"
            @click="goToStep(step)"
          />
        </div>

        <div class="p-4">
          <BranchStep v-if="bookingStore.currentStep === 'branch'" />
          <ServiceStep v-if="bookingStore.currentStep === 'treatment'" />
          <DateStep v-if="bookingStore.currentStep === 'date'" />
          <RoomStep v-if="bookingStore.currentStep === 'room'" />
          <StaffStep v-if="bookingStore.currentStep === 'staff'" />
          <ConfirmStep v-if="bookingStore.currentStep === 'confirm'" />
        </div>
      </div>
    </USlideover>
  </ClientOnly>
</template>
