<script setup>
const props = defineProps(['item']);
const emit = defineEmits(['update-qty', 'remove']);

const formattedPrice = (val) => {
  return formatIDR(Math.round(val / 1000)) + 'K';
};

const handleAdd = () => {
  if (props.item.session_type === 'voucher') {
    // Original Logic: max 5 sets
    if (props.item.quantity + props.item.voucher_normal_quantity <= props.item.voucher_normal_quantity * 5) {
      emit('update-qty', props.item.voucher_normal_quantity);
    } else {
      alert("Maksimal pembelian adalah 5 set voucher.");
    }
  }
};

const handleSubtract = () => {
  if (props.item.session_type === 'voucher') {
    // Original Logic: min 1 set
    if (props.item.quantity - props.item.voucher_normal_quantity >= props.item.voucher_normal_quantity) {
      emit('update-qty', -props.item.voucher_normal_quantity);
    } else {
      alert("Minimal pembelian adalah 1 set voucher.");
    }
  }
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center py-6 gap-6">
    <div class="flex flex-1 gap-4 items-start">
      <NuxtImg 
        :src="item.treatment.icon_img ? `${$config.public.serverURL}${item.treatment.icon_img}` : '//placehold.co/180x180'" 
        class="w-32 h-32 rounded-2xl object-cover shadow-sm"
      />
      <div>
        <span class="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-100 text-slate-500 italic">
          {{ item.session_type === 'voucher' ? 'Voucher Purchase' : 'Session Order' }}
        </span>
        
        <h4 class="text-lg font-bold text-slate-800 mt-1">{{ item.treatment.name }}</h4>
        
        <div v-if="item.session_type === 'voucher'" class="text-xs text-slate-400 mt-1">
          Voucher without expiry
        </div>
        <div v-else class="text-xs text-slate-500 mt-2 space-y-1">
          <p><strong>Date : </strong> {{ item.session_date }}</p>
          <p><strong>Time : </strong> {{ item.session_time }}</p>
          <p><strong>Therapist : </strong> {{ item.employee.name }}</p>
          <p><strong>Room : </strong> {{ item.room.name }}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center border rounded-xl bg-slate-50">
        <button 
          :disabled="item.session_type !== 'voucher'"
          class="px-3 py-2 disabled:opacity-20 text-[#8B6E1C] font-bold"
          @click="handleSubtract"
        >—</button>
        <span class="w-8 text-center font-bold">{{ item.quantity }}</span>
        <button 
          :disabled="item.session_type !== 'voucher'"
          class="px-3 py-2 disabled:opacity-20 text-[#8B6E1C] font-bold"
          @click="handleAdd"
        >+</button>
      </div>
    </div>

    <div class="w-32 text-right">
      <p class="text-xs text-slate-400">Subtotal</p>
      <p class="font-black text-[#8B6E1C] text-lg">
        {{ formattedPrice(item.session_type === 'voucher' ? (item.price * (item.quantity/item.voucher_normal_quantity) * item.voucher_purchase_quantity) : item.price * item.quantity) }}
      </p>
    </div>

    <button class="text-rose-500 hover:bg-rose-50 rounded-full transition-colors" @click="emit('remove')">
      <UIcon name="i-lucide-trash" class="w-5 h-5" />
    </button>
  </div>
</template>