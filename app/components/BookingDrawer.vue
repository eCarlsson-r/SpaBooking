<script setup>
  import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer'
  // Use storeToRefs for cleaner template access and to avoid 'undefined' during init
  import { storeToRefs } from 'pinia'
  const bookingStore = useBookingStore()
  const { isOpen, currentStep } = storeToRefs(bookingStore)

  const steps = ['branch', 'treatment', 'date', 'room', 'staff', 'confirm']

  const canNavigateTo = (step) => {
    const currentIndex = steps.indexOf(bookingStore.currentStep)
    const targetIndex = steps.indexOf(step)
    // Allow going back to any step, or forward only to the next logical step
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
    <Drawer v-model:open="bookingStore.isOpen">
    <DrawerContent class="bg-slate-50">
      <div class="mx-auto w-full max-w-sm px-4">
        <div class="flex justify-between items-center py-4 border-b mb-4">
           <button
            v-if="bookingStore.currentStep !== 'branch'" 
            @click="goToStep(steps[steps.indexOf(bookingStore.currentStep)-1])">
            <UIcon name="i-material-symbols-chevron-left-rounded" class="w-5 h-5 text-slate-500" />
           </button>
           <span class="font-bold capitalize">{{ bookingStore.currentStep }}</span>
           <DrawerClose>
            <UIcon name="i-material-symbols-close" class="w-5 h-5 text-slate-300" />
           </DrawerClose>
        </div>

        <div class="flex gap-2 mb-6">
          <button 
            v-for="step in steps" :key="step"
            :disabled="!canNavigateTo(step)"
            :class="['h-2 flex-1 rounded-full transition-all', 
              bookingStore.currentStep === step ? 'bg-blue-600' : 'bg-slate-100']"
            @click="goToStep(step)"
          />
        </div>

        <div class="p-4 pb-0">
          <BranchStep v-if="bookingStore.currentStep === 'branch'" />
          <ServiceStep v-if="bookingStore.currentStep === 'treatment'" />
          <DateStep v-if="bookingStore.currentStep === 'date'" />
          <RoomStep v-if="bookingStore.currentStep === 'room'" />
          <StaffStep v-if="bookingStore.currentStep === 'staff'" />
          <ConfirmStep v-if="bookingStore.currentStep === 'confirm'" />
        </div>
      </div>
    </DrawerContent>
  </Drawer>
  </ClientOnly>
</template>