<template>
  <div class="pt-20 pb-32 px-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-black italic text-primary-900">My Vouchers</h1>
      <span class="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
        {{ activeVouchers.length }} Active
      </span>
    </div>

    <div v-if="activeVouchers.length > 0" class="space-y-4">
      <div
v-for="voucher in activeVouchers" :key="voucher.id" 
           class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        
        <div class="p-5 flex gap-4">
          <NuxtImg :src="voucher.treatment_img" class="w-16 h-16 rounded-2xl object-cover" />
          
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 leading-tight">{{ voucher.treatment_name }}</h4>
            <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              ID: {{ voucher.purchase_code }}
            </p>
            
            <div class="mt-4">
              <div class="flex justify-between text-[10px] mb-1 font-bold">
                <span class="text-slate-400">SESSIONS REMAINING</span>
                <span class="text-primary-900">{{ voucher.remaining }} / {{ voucher.total }}</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  class="bg-lime-300 h-full transition-all duration-500" 
                  :style="{ width: (voucher.remaining / voucher.total) * 100 + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 px-5 py-3 flex justify-between items-center">
          <span class="text-[9px] text-slate-400 italic">No Expiry Date</span>
          <button class="text-primary-900 text-xs font-black uppercase" @click="useVoucher(voucher)">
            Book Now →
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
      <p class="text-slate-400 text-sm">You don't have any active vouchers yet.</p>
      <NuxtLink to="/catalog" class="mt-4 inline-block bg-lime-300 text-white px-6 py-3 rounded-2xl font-bold">
        Browse Treatments
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp()
const activeVouchers = ref([])

// Fetch from your Laravel backend (e.g., /api/user/vouchers)
const fetchVouchers = async () => {
  try {
    const res = await $api('/user-vouchers')
    activeVouchers.value = res.data || res
  } catch (err) {
    console.error("Failed to load vouchers", err)
  }
}

const useVoucher = (voucher) => {
  // Logic to navigate to booking with this specific voucher ID
  navigateTo(`/booking?voucher_id=${voucher.id}`)
}

onMounted(() => {
  fetchVouchers()
})
</script>