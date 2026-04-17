<script setup lang="ts">
  const { t } = useI18n()
</script>
<template>
  <footer>
      <div class="bg-yellow-900 py-4 text-center text-sm text-white border-t border-white/10">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </div>
    </footer>
</template>
<style scoped></style>
