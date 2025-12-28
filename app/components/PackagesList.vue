<script setup lang="ts">
  // const props = defineProps({
  // 	name: {
  // 		type: String,
  // 		default: 'LaunchSale',
  // 	},
  // })

  // const emit = defineEmits(['addToCart'])

  // // Use the addToCart function like this:
  // // Eg-1: addToCart('pizza', 10)
  // // Eg-2: (event) => addToCart('pizza', 10, event)
  // const addToCart = (item, quantity /*, event*/) => {
  // 	emit('addToCart', { item, quantity })
  // }
</script>
<template>
  <section>
    <UCard>
      <div
        class="bg-clip-text bg-gradient-to-r from-lime-400 font-extrabold text-center to-yellow-700"
      >
        <span class="tracking-wide font-semibold text-3xl uppercase">
          Check out our exclusive packages at
        </span>
        <UButton class="tracking-wide font-bold text-3xl uppercase whitespace-nowrap">
          Packages List
        </UButton>
      </div>
    </UCard>
  </section>
</template>
