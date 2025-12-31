export const useRealtimeSync = (syncMap: Record<string, () => Promise<void>>) => {
  const { $echo } = useNuxtApp()

  onMounted(() => {
    // We listen on the same channel defined in Laravel
    $echo.channel('app-sync')
      .listen('.entity.updated', (e: { type: string }) => {
        // If the broadcast type (e.g., 'treatments') exists in our map, call its refresh function
        if (syncMap[e.type]) {
          console.log(`[Realtime] Syncing ${e.type}...`)
          syncMap[e.type]()
        }
      })
  })

  onUnmounted(() => {
    $echo.leaveChannel('app-sync')
  })
}