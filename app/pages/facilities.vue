<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Our Treatment Rooms</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="room in rooms" :key="room.id" :title="room.name">
        <NuxtImg :src="room.image ? `${$config.public.serverURL}/${room.image}` : '//placehold.co/600x400'" height="250" />
        <div>
          <h5>{{ room.name }}</h5>
          <span>{{ room.description }}</span>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
  const { $api } = useNuxtApp();
  // useAsyncData is preferred over useFetch when using a custom fetcher
  const { data: rooms, refresh: refreshRooms } = await useAsyncData('room', () => $api('/room'))

  // Just pass the map of types to their refresh functions
  useRealtimeSync({
    'room': refreshRooms,
  })

  definePageMeta({
    // layout: 'default',
    // name: 'index',
    // alias: 'index',
    title: 'Facilities',
    description: 'Explore our relaxing facilities.',
    navOrder: 4,
    type: 'primary',
    icon: 'i-mdi-home'
  })
</script>