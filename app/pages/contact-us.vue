<script setup>
  import { Button } from '@/components/ui/button'
  const { $api } = useNuxtApp();
  // useAsyncData is preferred over useFetch when using a custom fetcher
  const { data: branches, refresh: refreshBranches } = await useAsyncData('branches', () => $api('/branch'))

  // Just pass the map of types to their refresh functions
  useRealtimeSync({
    'branches': refreshBranches,
  })
  const selectedBranch = ref(null);

  const bookingStore = useBookingStore();

  const bookThisBranch = (branch) => {
    bookingStore.setBranch(branch) // This sets the ID and moves currentStep to 'treatment'
    bookingStore.isOpen = true     // Opens the drawer
  }

  // Set the first branch as default once data loads
  watch(branches, (newVal) => {
    if (newVal?.length > 0) selectedBranch.value = newVal[0]
  }, { immediate: true })
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
    <div class="space-y-4">
      <div 
        v-for="branch in branches" :key="branch.id"
        :class="[
          'p-5 rounded-3xl border-2 transition-all cursor-pointer grid grid-cols-2 gap-3',
          selectedBranch?.id === branch.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'
        ]"
        @click="selectedBranch = branch"
      >
        <div>
          <h3 class="font-bold text-lg">{{ branch.name }}</h3>
          <p class="text-sm text-slate-500 mb-3">{{ branch.address }}</p>
          
          <div class="grid grid-cols-2 gap-2">
            <Button size="sm" class="bg-green-500 hover:bg-green-600 text-white" @click.stop="openWhatsApp(branch)">WhatsApp</Button>
            <Button size="sm" variant="outline" @click.stop="callBranch(branch.phone)">Call</Button>
            <Button size="sm" class="col-span-2 bg-primary-500 hover:bg-primary-600 text-white" @click="bookThisBranch(branch)">
              Book at this Branch
            </Button>
          </div>
        </div>

        <div>
          <img :src="`${$config.public.serverURL}${branch.image}`" class="w-full h-[200px] object-cover rounded-3xl" alt="">
        </div>
      </div>
    </div>

    <div class="md:sticky md:top-24 h-fit">
      <h2 class="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Lokasi Cabang</h2>
      <div v-if="selectedBranch" class="w-full h-[400px] rounded-3xl overflow-hidden border shadow-sm">
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          style="border:0"
          :src="`https://maps.google.com/maps?q=${encodeURIComponent(selectedBranch.name + ' ' + selectedBranch.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
          allowfullscreen
          loading="lazy"
        />
      </div>
      
      <div v-else class="h-[400px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center">
        <p class="text-slate-400">Pilih cabang untuk melihat peta</p>
      </div>
    </div>
  </div>
</template>