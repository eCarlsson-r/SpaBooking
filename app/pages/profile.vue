<script setup>
const auth = useAuthStore();

const handleLogout = () => {
  auth.logout();
  navigateTo('/login');
};
</script>

<template>
  <div class="min-h-screen bg-slate dark:bg-slate-95050 dark:bg-slate-950 pb-32">
    <div class="px-6 pt-8 pb-6">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Welcome back,</p>
      <h1 class="text-3xl font-black italic text-primary-900">{{ auth.user?.customer.name }}</h1>
    </div>

    <div class="px-6 grid md:grid-cols-3 gap-3">
      <NuxtLink to="/bookings" class="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 active:scale-[0.98] transition-transform">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-sm">
            <UIcon name="i-mdi-calendar" class="w-6 h-6 text-primary-900 dark:text-primary-100" />
          </div>
          <div>
            <p class="font-bold text-slate-800 dark:text-slate-200">My Bookings</p>
            <p class="text-[10px] text-slate-400 uppercase font-bold">Manage Sessions</p>
          </div>
        </div>
        <UIcon name="i-material-symbols-chevron-right-rounded" class="w-5 h-5 text-slate-300" />
      </NuxtLink>

      <NuxtLink to="/vouchers" class="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 active:scale-[0.98] transition-transform">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-sm">
            <UIcon name="i-ci-ticket-voucher" class="w-6 h-6 text-primary-900 dark:text-primary-100" />
          </div>
          <div>
            <p class="font-bold text-slate-800 dark:text-slate-200">Voucher Wallet</p>
            <p class="text-[10px] text-slate-400 uppercase font-bold">Usage & Progress</p>
          </div>
        </div>
        <UIcon name="i-material-symbols-chevron-right-rounded" class="w-5 h-5 text-slate-300" />
      </NuxtLink>

      <NuxtLink to="/history" class="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 active:scale-[0.98] transition-transform">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-sm">
            <UIcon name="i-material-symbols-receipt" class="w-6 h-6 text-primary-900" />
          </div>
          <div>
            <p class="font-bold text-slate-800 dark:text-slate-200">Purchase History</p>
            <p class="text-[10px] text-slate-400 uppercase font-bold">Receipts & Orders</p>
          </div>
        </div>
        <UIcon name="i-material-symbols-chevron-right-rounded" class="w-5 h-5 text-slate-300" />
      </NuxtLink>

    </div>

    <div class="mt-8 px-6">
       <ParticularsSection />
    </div>

    <div class="px-6 mt-12">
      <button class="w-full py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100" @click="handleLogout">
        Sign Out of Account
      </button>
    </div>
  </div>
</template>