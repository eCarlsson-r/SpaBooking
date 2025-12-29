<script lang="ts">
  export default {
      props: {
        id: Number,
        name: String,
        description: String,
        header_img: String
      }
    }
</script>
<template>
  <NuxtLink
    class="m-4 relative w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
    :to="`/treatments/${id}`"
    >
    <UCard class="md:h-full">
      <div class="flex justify-center">
          <div class="bg-white h-64 rounded-lg">
            <NuxtImg class="max-h-full" :src="`${$config.public.serverURL}${header_img}`" height="250" />
          </div>
      </div>
      <div>
        <h4>{{ name }}</h4>
        <p>{{ description }}</p>
      </div>
    </UCard>
  </NuxtLink>
</template>
<style scoped></style>
