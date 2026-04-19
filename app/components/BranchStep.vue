<script setup>
const bookingStore = useBookingStore()
const { data: branches, refresh: refreshBranches } = useBranches()
useRealtimeSync({ 'branches': refreshBranches })
</script>

<template>
  <div class="space-y-4">
    <div v-if="pending" class="space-y-3">
      <Skeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-2xl" />
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      <button 
        v-for="branch in branches" :key="branch.id"
        class="flex flex-col items-start p-5 bg-white border-2 border-slate-100 rounded-3xl text-left transition-all hover:border-primary-900 active:scale-[0.98]"
        @click="bookingStore.setBranch(branch)"
      >
        <span class="font-black text-lg text-slate-800">{{ branch.name }}</span>
        <span class="text-xs text-slate-500 leading-tight mt-1">{{ branch.address }}</span>
      </button>
    </div>
  </div>
</template>