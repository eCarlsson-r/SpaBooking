<script setup>
  const { t } = useI18n()
  const toast = useToast()
  const auth = useAuthStore()
  const isEditing = ref(false)
  const editForm = ref({ ...auth.user.customer })

  const saveProfile = async () => {
    const result = await auth.updateProfile(editForm.value)
    
    if (result.success) {
      isEditing.value = false
      toast.add({
        title: t('booking.success'),
        description: t('profile.profileUpdated'),
        color: 'green',
      })  
    } else {
      toast.add({
        title: t('booking.error'),
        description: t('profile.profileUpdateFailed'),
        color: 'red',
      })
    }
  }

  const { public: { siteUrl } } = useRuntimeConfig()

  const shareReferral = async () => {
    const shareData = {
      title: 'Carlsson Spa Referral',
      text: `Get a special discount at Carlsson Spa using my referral code: ${auth.user.customer.referral_code}`,
      url: `${siteUrl}/register`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard if Share API is not supported (Desktop)
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        toast.add({
          title: t('booking.success'),
          description: t('profile.referralCopied'),
          color: 'green',
        })
      }
    } catch (err) {
      console.log('Share failed', err)
    }
  }
</script>
<template>
  <div class="space-y-6">
    <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="font-black text-slate-800 italic tracking-tight text-xl uppercase">{{ t('profile.profileTitle') }}</h3>
        </div>
        <button 
          class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-100 transition-colors" 
          :class="isEditing ? 'bg-slate-900 text-white' : 'text-slate-400'"
          @click="isEditing = !isEditing"
        >
          {{ isEditing ? t('profile.close') : t('profile.edit') }}
        </button>
      </div>

      <form class="space-y-5" @submit.prevent="saveProfile">
        <div class="flex flex-col">
          <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{{ t('profile.fullName') }}</label>
          <input 
            v-if="isEditing" 
            v-model="editForm.name" 
            class="bg-slate-50 p-4 rounded-2xl border-none font-bold text-slate-800 focus:ring-2 focus:ring-lime-500/20"
          >
          <p v-else class="font-black text-slate-800 text-lg border-b border-slate-50 pb-2 ml-1">{{ auth.user?.customer.name }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{{ t('profile.phoneNumber') }}</label>
          <input 
            v-if="isEditing" 
            v-model="editForm.mobile" 
            class="bg-slate-50 p-4 rounded-2xl border-none font-bold text-slate-800 focus:ring-2 focus:ring-lime-500/20"
          >
          <p v-else class="font-black text-slate-800 text-lg border-b border-slate-50 pb-2 ml-1">{{ auth.user?.customer.mobile }}</p>
        </div>

        <button v-if="isEditing" type="submit" class="w-full py-4 bg-lime-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest mt-4">
          {{ t('profile.updateProfile') }}
        </button>
      </form>
    </div>

    <div class="bg-primary-900 rounded-[2.5rem] p-8 text-white shadow-lg shadow-primary-900/20">
      <h4 class="font-black italic text-lg uppercase tracking-tight">{{ t('profile.referFriend') }}</h4>
      <p class="text-[11px] text-white/70 mt-1 leading-relaxed">
        {{ t('profile.referralDescription') }}
      </p>
      
      <div class="flex items-center justify-between mt-6 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
        <code class="font-black text-xl tracking-widest">{{ auth.user?.customer.referral_code }}</code>
        <button class="bg-white text-primary-900 p-3 rounded-xl shadow-sm active:scale-90 transition-transform" @click="shareReferral">
          <UIcon name="i-tabler-share" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>