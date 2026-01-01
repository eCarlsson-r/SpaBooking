<script setup>
const {$api} = useNuxtApp();
const {user} = useAuthStore();
const { data: appointments, refresh } = await $api('/session', {
  headers: useRequestHeaders(['cookie']),
  customer_id: user.customer.id
})

const getStatusColor = (status) => {
  switch(status) {
    case 'completed': return 'bg-green-100 text-green-700';
    case 'waiting': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-black">Booking Saya</h1>
    
    <div v-if="appointments?.length === 0" class="text-center py-10">
      <p class="text-slate-400 italic">Belum ada riwayat perawatan.</p>
    </div>

    <div
      v-for="item in appointments" :key="item.id" 
      class="bg-white border rounded-3xl p-5 shadow-sm">
      <div class="flex justify-between items-start mb-3">
        <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase', getStatusColor(item.status)]">
          {{ item.status }}
        </span>
        <span class="text-xs text-slate-400 font-mono">{{ item.session_date }}</span>
      </div>
      
      <h3 class="font-bold text-lg leading-tight">{{ item.treatment.name }}</h3>
      <p class="text-sm text-slate-500 mb-4">{{ item.branch.name }} • {{ item.employee.nickname }}</p>
      
      <div class="flex gap-2">
        <button class="flex-1 rounded-xl">Petunjuk Arah</button>
        <button class="flex-1 text-red-500">Batal</button>
      </div>
    </div>
  </div>
</template>