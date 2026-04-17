<script setup lang="ts">
  const { locale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const handleSwitch = (newLocale: string) => {
    const path = switchLocalePath(newLocale)
    navigateTo(path)
  }
</script>

<template>
  <UDropdown :items="[
    [
      {
        label: 'English',
        click: () => handleSwitch('en'),
        disabled: locale === 'en'
      },
      {
        label: 'Bahasa Indonesia',
        click: () => handleSwitch('id'),
        disabled: locale === 'id'
      }
    ]
  ]">
    <UButton
      variant="ghost"
      size="sm"
      :trailing-icon="'i-heroicons-language'"
    >
      {{ locale.toUpperCase() }}
    </UButton>
  </UDropdown>
</template>