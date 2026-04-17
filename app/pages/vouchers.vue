<template>
  <div class="pt-20 pb-32 px-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-black text-primary-900 mb-8">{{ t('vouchers.title') }}</h1>
      <span class="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
        {{ t('vouchers.vouchersCount', { count: activeVouchers?.length || 0 }) }}
      </span>
    </div>

    <div v-if="activeVouchers?.length > 0" class="space-y-4">
      <div
        v-for="voucher in activeVouchers" :key="voucher.id" 
        class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        
        <div class="p-5 flex gap-4">
          <NuxtImg :src="voucher.treatment.icon_img ? `${$config.public.serverURL}${voucher.treatment.icon_img}` : 'placehold.co/'" class="w-16 h-16 rounded-2xl object-cover" />
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 leading-tight">{{ voucher.treatment.name }}</h4>
            <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              {{ t('vouchers.id') }} {{ voucher.id }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
      <p class="text-slate-400 text-sm">{{ t('vouchers.noVouchers') }}</p>
      <NuxtLink to="/catalog" class="mt-4 inline-block bg-lime-500 text-white px-6 py-3 rounded-2xl font-bold">
        {{ t('vouchers.browseTreatments') }}
      </NuxtLink>
    </div>
  </div>
</template>
<script setup>
const { t } = useI18n()
const { $api } = useNuxtApp()
const { user } = useAuthStore();

const { data: activeVouchers, refresh } = await $api('/voucher', {
  customer_id: user.customer.id
});

// Fetch from your Laravel backend (e.g., /api/user/vouchers)
const fetchVouchers = async () => {
  try {
    const res = await $api('/voucher', {
      customer_id: user.customer.id
    });
    activeVouchers.value = res
  } catch (err) {
    console.error("Failed to load vouchers", err)
  }
}

onMounted(() => {
  fetchVouchers()
})
</script>