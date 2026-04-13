// since `.js, .ts` files are not included by default,
// the following comment tells UnoCSS to force scan this file (to pick the logo icon).
// @unocss-include

export default {
  title: 'Carlsson Spa',
  description:
    'Luxury Spa & Wellness Center - Online Booking Portal',
  logo: 'i-fluent-emoji:sparkles',
  author: 'Carlsson Spa Team',
  url: process.env.NUXT_PUBLIC_SITE_URL || 'https://carlsson-spa.com',
  github: 'https://github.com/eCarlsson-r/SpaBooking',
  ogImageUrl: 'og-image.jpg', // absolute url (or) from public folder
  generator: 'https://vuedesigner.com',
  defaultLocale: 'en', // default
  identity: {
    type: 'Organization',
  } as any,
  twitter: '@vuedesigner',
  trailingSlash: false, // default
  titleSeparator: '|', // default

  navs: {
    primary: [
      { title: 'Treatments', to: '/treatments', icon: 'i-mdi-home' },
      { title: 'Vouchers', to: '/catalog', icon: 'i-mdi-home' },
      { title: 'Facilities', to: '/facilities', icon: 'i-mdi-home' },
      { title: 'Contact', to: '/contact-us', icon: 'i-material-symbols-add-call' }
    ],
    secondary: [
      {
        title: 'Profile',
        to: '/profile',
        icon: 'i-material-symbols-account-circle-outline',
      },
      {
        title: 'My Bookings',
        to: '/bookings',
        icon: 'i-mdi-calendar',
      },
      {
        title: 'My Vouchers',
        to: '/vouchers',
        icon: 'i-ci-ticket-voucher',
      },
      {
        title: 'Purchase History',
        to: '/history',
        icon: 'i-ic-baseline-history',
      }
    ],
  },
}
