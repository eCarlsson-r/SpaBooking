<script setup lang="ts">
/**
 * Persistent floating chat widget for authenticated customers.
 * Shows typing indicator while AI is processing.
 * On booking_intent response, navigates to /checkout with pre-populated params.
 * On service unavailability (error), shows fallback message with link to /bookings.
 * Requirements: 4.1, 4.3, 4.5, 4.6, 4.8
 */
import { storeToRefs } from 'pinia'
import type { ChatResponse } from '~~/types/ai'

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const chatStore = useChatStore()
const { messages, isTyping } = storeToRefs(chatStore)

const router = useRouter()

const isOpen = ref(false)
const inputText = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// Track if the last response was a service error for fallback UI
const showFallback = ref(false)

const toggleWidget = () => {
  isOpen.value = !isOpen.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
  // Check if last assistant message indicates service unavailability
  const lastMsg = messages.value[messages.value.length - 1]
  if (lastMsg?.role === 'assistant' && lastMsg.content.includes('temporarily unavailable')) {
    showFallback.value = true
  } else {
    showFallback.value = false
  }
}, { deep: true })

watch(isOpen, (val) => {
  if (val) scrollToBottom()
})

const sendMessageWithNavigation = async () => {
  const text = inputText.value.trim()
  if (!text || isTyping.value) return

  inputText.value = ''
  showFallback.value = false

  // Add user message
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: new Date().toISOString(),
  })

  chatStore.$patch({ isTyping: true })

  try {
    const { $api } = useNuxtApp()
    const response = await ($api as any)('/ai/chat', {
      method: 'POST',
      body: {
        message: text,
        session_id: chatStore.sessionId,
      },
    }) as { response: ChatResponse; session_id: string }

    const chatResponse = response.response

    if (response.session_id) {
      chatStore.$patch({ sessionId: response.session_id })
    }

    if (chatResponse.type === 'booking_intent') {
      // Navigate to checkout with pre-populated params
      const { date, time, treatmentId, branchId } = chatResponse.params
      messages.value.push({
        role: 'assistant',
        content: 'I found a booking option for you. Taking you to checkout now...',
        timestamp: new Date().toISOString(),
      })
      await nextTick()
      await router.push({
        path: '/checkout',
        query: { date, time, treatmentId, branchId },
      })
      isOpen.value = false
    } else if (chatResponse.type === 'clarification') {
      messages.value.push({
        role: 'assistant',
        content: chatResponse.message,
        timestamp: new Date().toISOString(),
      })
    } else if (chatResponse.type === 'data_response') {
      messages.value.push({
        role: 'assistant',
        content: chatResponse.formattedAnswer,
        timestamp: new Date().toISOString(),
      })
    } else if (chatResponse.type === 'error') {
      messages.value.push({
        role: 'assistant',
        content: chatResponse.message,
        timestamp: new Date().toISOString(),
      })
      showFallback.value = true
    }
  } catch {
    messages.value.push({
      role: 'assistant',
      content: 'The assistant is temporarily unavailable. Please use the manual booking flow.',
      timestamp: new Date().toISOString(),
    })
    showFallback.value = true
  } finally {
    chatStore.$patch({ isTyping: false })
  }

  // Trim to last 10 messages
  if (messages.value.length > 10) {
    chatStore.$patch({ messages: messages.value.slice(-10) })
  }
}

const handleSend = () => {
  sendMessageWithNavigation()
}

const handleKeydownSend = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <ClientOnly>
    <div v-if="isLoggedIn" class="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      <!-- Chat Panel -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-2"
      >
        <div
          v-if="isOpen"
          class="w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-700 flex flex-col overflow-hidden"
          style="max-height: 480px;"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 bg-primary-600 text-white">
            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-sparkles" class="w-5 h-5" />
              <span class="font-bold text-sm">Booking Assistant</span>
            </div>
            <button
              class="hover:opacity-75 transition-opacity"
              aria-label="Close chat"
              @click="isOpen = false"
            >
              <UIcon name="i-material-symbols-close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Messages -->
          <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
            style="max-height: 320px;"
          >
            <!-- Empty state -->
            <div v-if="messages.length === 0" class="text-center text-slate-400 text-sm py-8">
              <UIcon name="i-mdi-chat-outline" class="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Hi! How can I help you book a treatment today?</p>
            </div>

            <!-- Message bubbles -->
            <div
              v-for="(msg, idx) in messages"
              :key="idx"
              :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-100 rounded-bl-sm',
                ]"
              >
                {{ msg.content }}
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-slate-100 dark:bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <div class="flex gap-1 items-center">
                  <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
                  <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
                  <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
                </div>
              </div>
            </div>

            <!-- Service unavailability fallback -->
            <div v-if="showFallback && !isTyping" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-sm">
              <p class="text-amber-800 dark:text-amber-200 mb-1">
                The assistant is temporarily unavailable.
              </p>
              <NuxtLink
                to="/bookings"
                class="text-primary-600 dark:text-primary-400 font-bold underline"
                @click="isOpen = false"
              >
                Go to manual booking →
              </NuxtLink>
            </div>
          </div>

          <!-- Input -->
          <div class="px-3 py-3 border-t border-slate-200 dark:border-neutral-700 flex gap-2 items-end">
            <textarea
              v-model="inputText"
              rows="1"
              placeholder="Type your message..."
              class="flex-1 resize-none rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-400"
              style="max-height: 80px;"
              :disabled="isTyping"
              @keydown="handleKeydownSend"
            />
            <button
              :disabled="!inputText.trim() || isTyping"
              class="shrink-0 w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
              @click="handleSend"
            >
              <UIcon name="i-material-symbols-send-rounded" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Transition>

      <!-- Floating toggle button -->
      <button
        class="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center"
        aria-label="Toggle chat assistant"
        @click="toggleWidget"
      >
        <UIcon
          :name="isOpen ? 'i-material-symbols-close' : 'i-mdi-chat-processing-outline'"
          class="w-6 h-6"
        />
      </button>
    </div>
  </ClientOnly>
</template>
