import { format } from 'date-fns'
import { id } from 'date-fns/locale' // Indonesian locale

export const formatFullDate = (date: Date | string) => {
  return format(new Date(date), 'EEEE, d MMMM yyyy', { locale: id })
}

export const formatTime = (date: Date | string) => {
  return format(new Date(date), 'HH:mm')
}

export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount)
}