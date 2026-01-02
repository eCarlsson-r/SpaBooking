<template>
  <div class="pt-20 pb-32 px-6">
    <h1 class="text-3xl font-black text-primary-900 mb-8">Purchase List</h1>

    <div v-if="purchases.length > 0" class="space-y-4">
      <div v-for="(group, month) in groupedPurchases" :key="month">
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
          {{ month }}
        </h3>
        
        <div class="space-y-3">
          <div
          v-for="order in group" :key="order.id" 
          class="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <div
                :class="order.is_voucher ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'" 
                class="w-10 h-10 rounded-2xl flex items-center justify-center"
              >
                <UIcon v-if="order.is_voucher" name="i-material-symbols-ticket" class="w-5 h-5" />
                <UIcon v-else name="i-tabler-massage" class="w-5 h-5" />
              </div>

              <div>
                <p class="font-bold text-sm text-slate-800">{{ order.records[0].description }}</p>
                <p class="text-[10px] text-slate-400">{{ order.date }}</p>
              </div>
            </div>

            <div class="text-right">
              <p class="font-black text-slate-800">
                IDR {{ (order.total / 1000).toLocaleString() }}K
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-[40px] border border-slate-100">
      <div class="mb-4 flex justify-center text-slate-200">
        <UIcon name="i-tabler-receipt-tax" class="w-16 h-16" />
      </div>
      <p class="text-slate-400 text-sm">No transactions found yet.</p>
    </div>
  </div>
</template>

<script setup>
    const { $api } = useNuxtApp();
    // useAsyncData is preferred over useFetch when using a custom fetcher
    const { data: purchases, refresh: refreshPurchases } = await useAsyncData('purchases', () => $api('/sales'))

    // Just pass the map of types to their refresh functions
    useRealtimeSync({
      'purchases': refreshPurchases,
    })

    // Logic to group your purchases by month for the UI
    const groupedPurchases = computed(() => {
    return purchases.value.reduce((groups, purchase) => {
      const date = new Date(purchase.date);
      const month = date.toLocaleDateString('en-US', { month: 'long' }) + ' ' + date.getFullYear(); // e.g., "October 2025"
      if (!groups[month]) groups[month] = [];
      groups[month].push(purchase);
      return groups;
    }, {});
    });
</script>