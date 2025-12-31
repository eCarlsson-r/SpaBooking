// since `.js, .ts` files are not included by default,
// the following comment tells UnoCSS to force scan this file (to pick the logo icon).
// @unocss-include

export default {
  title: 'Carlsson Spa',
  description:
    'Luxury Spa & Wellness Center - Online Booking Portal',
  logo: 'i-fluent-emoji:sparkles',
  author: 'Carlsson Spa Team',
  url: 'http://localhost:3001',
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
      { title: 'Vouchers', to: '/vouchers', icon: 'i-mdi-home' },
      { title: 'Facilities', to: '/facilities', icon: 'i-mdi-home' },
      { title: 'Contact Us', to: '/contact-us', icon: 'i-material-symbols-add-call' }
    ],
    secondary: [
      {
        title: 'Order History',
        to: '/order-history',
        icon: 'i-ic-baseline-history',
      },
      {
        title: 'Returns',
        to: '/returns',
        icon: 'i-material-symbols-assignment-return-outline-rounded',
      },
      {
        title: 'Delivery Policy',
        to: '/delivery-policy',
        icon: 'i-tabler-truck-return',
      },
      {
        title: 'Help & FAQs',
        to: '/help-faqs',
        icon: 'i-material-symbols-contact-support-outline',
      },
    ],
  },
}
