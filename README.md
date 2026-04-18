# SpaBooking

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.15+-00DC82.svg?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D.svg?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Lighthouse 100](https://img.shields.io/badge/Lighthouse-100-orange.svg?logo=lighthouse&logoColor=white)](https://web.dev/performance-scoring/)

> **Premium Booking Experience, Redefined.**
> An exquisite, high-performance customer interface for the modern spa. Built with Nuxt 3/4 and Pinegrow, SpaBooking delivers a seamless, app-like experience that converts visitors into lifelong clients.

## ✨ Highlights

### 🎨 Visual Excellence

- **Pinegrow Powered**: Pixel-perfect designs crafted with the precision of a professional designer.
- **Mobile-First Responsiveness**: Fully optimized for smartphones and tablets with a fluid, adaptive layout.
- **Nuxt UI & UnoCSS**: A stunning, accessible, and ultra-fast component system.
- **Micro-interactions**: Fluid transitions and interactive elements that feel premium and responsive.

### ⚡ Technical Superiority

- **Nuxt 3/4 Future-Ready**: Leveraging the latest in Vue and Nuxt innovation (SSR, Component Islands, Future Flags).
- **Multilingual (i18n)**: Full internationalization support with localized routing and SEO.
- **SEO Perfection**: Industry-leading SEO with `unhead` and `@nuxtjs/seo`, ensuring your spa ranks where it matters.
- **Real-time Sync**: Seamless integration with **Laravel Echo** and **Pusher** for instant booking confirmations and state updates.

### 🛋️ Client Experience

- **Fluid Checkout**: An optimized, multi-step booking and checkout flow designed for conversion.
- **Progressive Web App (PWA)**: Installable on mobile devices with offline support and sync notifications.
- **Live Catalog**: Dynamic treatment browsing with rich imagery and detailed service descriptions.
- **Customer History**: Personalized dashboard for clients to track their wellness journey, vouchers, and upcoming sessions.

## 🛠️ Tech Stack

- **Foundation**: Nuxt 3.15 (SSR Ready)
- **UI/UX**: Nuxt UI + Tailwind CSS + UnoCSS
- **Design Toolkit**: Pinegrow Live Designer
- **State Management**: Pinia (Modular stores)
- **Connectivity**: Laravel Echo + Pusher (Real-time events)
- **Validation**: VeeValidate + ZOD
- **Icons**: Lucide + Iconify (Tree-shaken)

## 🏁 Getting Started

### Quick Start

Ensure you have the [SpaSystem-API](https://github.com/your-org/SpaSystem-API) running first.

```bash
# Clone the repository
git clone <repository-url>
cd SpaBooking

# Install dependencies
npm install

# Start the premium experience
npm run dev

# (Optional) Seed the database for a full demo experience
# In the SpaInformationSystem-API directory:
php artisan migrate:fresh --seed
```

### Configuration

Update `nuxt.config.ts` or `.env` with your API endpoints:

```typescript
public: {
  apiBase: 'http://localhost:8000/api',
  serverURL: 'http://localhost:8000',
  reverbHost: 'localhost',
  reverbKey: 'your-key-here'
}
```

## 📈 Performance & Quality

We take web performance seriously. SpaBooking is designed to hit 100/100 across the board:

- **Critters**: Critical CSS extraction for instant paint.
- **Fontaine**: Font metric overrides to eliminate CLS.
- **Nuxt Image**: Automated image optimization and WebP delivery.

## 📁 Project Map

- `app/pages`: Dynamic routing and exquisite layouts.
- `app-nuxtui-layer`: Shared branding, navigation, and footer components.
- `stores`: Client-side state logic for carts, auth, and sessions.
- `assets/css`: Professional Tailwind/PostCSS configuration.

---

Crafted with ❤️ for the Wellness Elite. Built on [Nuxt](https://nuxt.com).
