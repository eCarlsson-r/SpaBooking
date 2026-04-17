import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { offlineQueue } from '../utils/offlineQueue';
import type { QueuedOperation } from '../utils/offlineQueue';

export interface UseOfflineQueueReturn {
  isOnline: Ref<boolean>;
  pendingCount: Ref<number>;
  enqueue: (op: Omit<QueuedOperation, 'id' | 'enqueuedAt' | 'retryCount' | 'status'>) => Promise<void>;
  flush: () => Promise<void>;
}

export function useOfflineQueue(): UseOfflineQueueReturn {
  // SSR guard: default to true if navigator is unavailable
  const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const pendingCount = ref(0);

  let pollInterval: ReturnType<typeof setInterval> | null = null;

  async function handleOnline() {
    isOnline.value = true;
    await flush();
  }

  function handleOffline() {
    isOnline.value = false;
  }

  async function updatePendingCount() {
    try {
      pendingCount.value = await offlineQueue.count();
    } catch {
      // silently ignore errors (e.g. IndexedDB unavailable)
    }
  }

  async function enqueue(op: Omit<QueuedOperation, 'id' | 'enqueuedAt' | 'retryCount' | 'status'>): Promise<void> {
    await offlineQueue.enqueue(op);
    await updatePendingCount();
  }

  async function flush(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) {
      return;
    }

    const controller = navigator.serviceWorker.controller;
    if (!controller) {
      return;
    }

    controller.postMessage({ type: 'FLUSH_QUEUE' });
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // Initial count
    updatePendingCount();

    // Poll every 2 seconds
    pollInterval = setInterval(updatePendingCount, 2000);
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }

    if (pollInterval !== null) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  });

  return { isOnline, pendingCount, enqueue, flush };
}
