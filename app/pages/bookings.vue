<template>
  <div class="pt-20 pb-32 px-6">
    <h1 class="text-3xl font-black text-primary-900 mb-8">My Sessions</h1>

    <div v-if="sessions.length > 0" class="space-y-6">
      <div v-for="session in sessions" :key="session.id" class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div class="p-6 flex gap-4">
          <div class="flex flex-col items-center justify-center bg-slate-50 rounded-2xl px-4 h-16 min-w-[70px]">
            <span class="text-[10px] font-black text-primary-900 uppercase">{{ new Date(session.date).format('MMM') }}</span>
            <span class="text-xl font-black text-slate-800">{{ new Date(session.date).format('DD') }}</span>
          </div>
          <div class="flex-1">
            <h4 class="font-black text-slate-800 text-lg leading-tight uppercase italic">{{ session.treatment.name }}</h4>
            <p class="text-xs text-slate-400 font-bold mt-1">{{ session.branch.name }} • {{ session.time }}</p>
          </div>
        </div>

        <div class="px-6 pb-6 space-y-3">
          <a 
            :href="`https://maps.google.com/maps?q=${encodeURIComponent(session.branch.name + ' ' + session.branch.address)}&t=&z=15&ie=UTF8`" 
            target="_blank"
            class="w-full flex items-center justify-center gap-2 bg-primary-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
          >
            <MapPinIcon class="w-4 h-4" />
            Directions
          </a>

          <div class="grid grid-cols-2 gap-3">
            <button class="bg-slate-50 text-slate-700 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100" @click="openReschedule(session)">
              Reschedule
            </button>
            <button class="text-red-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-50" @click="confirmCancel(session)">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-slate-400 font-medium">No walk-in sessions booked.</p>
      <NuxtLink to="/catalog" class="mt-4 inline-block text-lime-500 font-black text-sm underline">
        Book a session now
      </NuxtLink>
    </div>

    <ReSchedule />
  </div>
</template>

<script setup>
  const { $api } = useNuxtApp();
  // useAsyncData is preferred over useFetch when using a custom fetcher
  const { data: sessions, refresh: refreshSessions } = await useAsyncData('sessions', () => $api('/session'))

  // Just pass the map of types to their refresh functions
  useRealtimeSync({
    'sessions': refreshSessions,
  })

const confirmCancel = async (session) => {
  // Logic for the "No Return" cancellation warning we discussed
  const confirm = window.confirm("Cancel walk-in session? This session cannot be returned.")
  if(confirm) {
    await $api(`/session/${session.id}`, { method: 'DELETE' })
    refreshSessions()
  }
}
</script>