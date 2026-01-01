<script setup>
const step = ref(1);
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  mobile: '',
  gender: 'F', // Default to Female for Spa context
  place_of_birth: '',
  date_of_birth: ''
});

const handleRegister = async () => {
  await useAuthStore().register(form);
};
</script>

<template>
  
  <div class="p-8">
    <div class="flex gap-2 mb-8">
      <div
        v-for="i in 2" :key="i" 
           class="h-1 flex-1 rounded-full transition-colors duration-500"
           :class="step >= i ? 'bg-primary-900' : 'bg-slate-100'"/>
    </div>

    <div v-show="step === 1" class="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 class="text-2xl font-black italic text-primary-700 uppercase">Personal Data</h2>
      <div class="space-y-4">
        <input v-model="form.name" placeholder="Full Name" class="border border-slate-400 w-full h-12 rounded-xl" >
        
        <div class="flex gap-4">
          <button
            :class="form.gender === 'M' ? 'bg-primary-900 text-white border-primary-700' : 'bg-white text-slate-400'" 
            class="flex-1 h-12 border rounded-xl font-bold transition-all"
            @click="form.gender = 'M'">Male</button>
          <button
            :class="form.gender === 'F' ? 'bg-primary-900 text-white border-primary-700' : 'bg-white text-slate-400'" 
            class="flex-1 h-12 border rounded-xl font-bold transition-all"
            @click="form.gender = 'F'">Female</button>
        </div>

        <div class="flex gap-4">
          <input v-model="form.place_of_birth" placeholder="Place of Birth" class="border border-slate-400 w-full h-12 rounded-xl" >
          <input v-model="form.date_of_birth" type="date" placeholder="Date of Birth" class="border border-slate-400 w-full h-12 rounded-xl" >
        </div>

        
        <input v-model="form.mobile" type="tel" placeholder="WhatsApp Number (e.g. 0812...)" class="border border-slate-400 w-full h-12 rounded-xl" >
      </div>
      <button class="w-full h-14 bg-primary-900 text-white rounded-2xl font-bold mt-6" @click="step = 2">Next Step</button>
    </div>

    <div v-show="step === 2" class="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 class="text-2xl font-black italic text-primary-700 uppercase">Your account</h2>
      <div class="space-y-4">
        <input v-model="form.email" type="email" placeholder="Email (Username)" class="border border-slate-400 w-full h-12 rounded-xl" >
        <input v-model="form.password" type="password" placeholder="Password" class="border border-slate-400 w-full h-12 rounded-xl" >
        <input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" class="border border-slate-400 w-full h-12 rounded-xl" >
      </div>
      <div class="flex gap-3 mt-6">
        <button class="h-14 px-6 rounded-2xl text-primary-900 border border-primary-900" @click="step = 1">
          <UIcon name="i-material-symbols-chevron-left-rounded"/>
        </button>
        <button class="flex-1 h-14 bg-primary-900 text-white rounded-2xl font-bold" @click="handleRegister">
          DAFTAR SEKARANG
        </button>
      </div>
    </div>
  </div>
</template>