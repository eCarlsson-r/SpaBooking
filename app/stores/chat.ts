import type { ChatMessage, ChatResponse } from '~~/types/ai'

const MAX_HISTORY = 10

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isTyping = ref(false)

  const { $api } = useNuxtApp()

  const sendMessage = async (message: string) => {
    // Add user message to history
    messages.value.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    })

    isTyping.value = true

    try {
      const chatResponse = await $api('/ai/chat', {
        method: 'POST',
        body: { message },
      }) as ChatResponse

      // Determine assistant message content
      let content: string
      if (chatResponse.type === 'clarification') {
        content = chatResponse.message
      } else if (chatResponse.type === 'data_response') {
        content = chatResponse.formattedAnswer
      } else if (chatResponse.type === 'error') {
        content = chatResponse.message
      } else {
        // booking_intent — provide a confirmation message
        content = 'I found a booking option for you. Let me take you to the checkout.'
      }

      messages.value.push({
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
      })

    } catch {
      messages.value.push({
        role: 'assistant',
        content: 'The assistant is temporarily unavailable. Please use the manual booking flow.',
        timestamp: new Date().toISOString(),
      })
    } finally {
      isTyping.value = false
    }

    // Trim to last 10 messages
    if (messages.value.length > MAX_HISTORY) {
      messages.value = messages.value.slice(-MAX_HISTORY)
    }
  }

  const clearHistory = () => {
    messages.value = []
    isTyping.value = false
  }

  return { messages, isTyping, sendMessage, clearHistory }
})
