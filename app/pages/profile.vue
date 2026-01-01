<template>
  <div class="min-h-screen bg-slate-50 pb-32">
    <div class="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black italic text-[#8B6E1C]">MY PROFILE</h1>
        <button class="text-slate-400 text-xs font-bold uppercase tracking-widest" @click="handleLogout">Logout</button>
      </div>
    </div>

    <div class="px-6 -mt-4 grid grid-cols-3 gap-3">
      <div class="bg-white p-4 rounded-2xl shadow-sm text-center border border-slate-100">
        <p class="text-lg font-bold text-slate-800">{{ cart.cartCount }}</p>
        <p class="text-[10px] text-slate-400 uppercase">Cart</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm text-center border border-slate-100">
        <p class="text-lg font-bold text-slate-800">12</p>
        <p class="text-[10px] text-slate-400 uppercase">Visits</p>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
        <div>
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Vouchers</h4>
          <p class="text-xl font-black text-slate-800">{{ activeVouchers.length }} Treatments</p>
        </div>
        <NuxtLink to="/vouchers" class="w-12 h-12 bg-[#8B6E1C] rounded-2xl flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <section class="p-6 bg-white rounded-3xl mb-4 border border-slate-100">
  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Account Particulars</h3>
  <div class="space-y-3">
    <div class="flex justify-between border-b pb-2">
      <span class="text-sm text-slate-500">Email</span>
      <span class="text-sm font-bold">{{ auth.user.email }}</span>
    </div>
    <div class="flex justify-between border-b pb-2">
      <span class="text-sm text-slate-500">Phone</span>
      <span class="text-sm font-bold">{{ auth.user.phone }}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-sm text-slate-500">Member Since</span>
      <span class="text-sm font-bold">{{ formatDate(auth.user.created_at) }}</span>
    </div>
  </div>
</section>

    <div class="px-6 mt-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-slate-800">Upcoming Sessions</h3>
        <NuxtLink to="/history" class="text-[#B6CE00] text-xs font-bold">See All</NuxtLink>
      </div>

      <div v-if="upcomingBookings.length" class="space-y-3">
        <div
        v-for="booking in upcomingBookings" :key="booking.id" 
             class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-[#8B6E1C]">
            <span class="text-[10px] uppercase font-bold leading-none">Oct</span>
            <span class="text-lg font-black leading-none">24</span>
          </div>
          <div class="flex-1">
            <p class="font-bold text-sm text-slate-800">{{ booking.treatment.name }}</p>
            <p class="text-[10px] text-slate-400">{{ booking.session_time }} • {{ booking.branch.name }}</p>
          </div>
          <ChevronRightIcon class="w-5 h-5 text-slate-300" />
        </div>
      </div>
      
      <div v-else class="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
        <p class="text-slate-400 text-sm">No upcoming appointments.</p>
        <NuxtLink to="/treatments" class="inline-block mt-3 text-sm font-bold text-[#8B6E1C]">Book a Treatment →</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const auth = useAuthStore();
const cart = useCartStore();
const upcomingBookings = ref([]); // Usually fetched from a useBookingStore

const handleLogout = () => {
  auth.logout();
  navigateTo('/login');
};
</script>