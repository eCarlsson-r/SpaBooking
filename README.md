# Carlsson Spa Booking

A premium online booking portal for Carlsson Spa & Wellness Center. Built with Nuxt 3, this frontend provides a seamless experience for customers to browse services and book appointments.

## Features

- **Service Catalog** - Browse spa treatments, massages, facials, and more
- **Online Booking** - Real-time appointment scheduling
- **Category Navigation** - Easy filtering of services by category
- **Customer Portal** - View order history and personalized info
- **Responsive Design** - Optimized for mobile and desktop booking

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue.js 3)
- **UI library**: [Nuxt UI](https://ui.nuxt.com/) (Tailwind CSS based)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Icons**: [UnoCSS Icons](https://unocss.dev/presets/icons)
- **Visual Design**: Integrated with [Vue Designer](https://vuedesigner.com/)

## Getting Started

### Prerequisites

- Node.js 20+
- Running [SpaSystem-API](file:///Users/lbert/Herd/SpaSystem-API) backend

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (copy `.env.example` to `.env`):

   ```env
   NUXT_PUBLIC_API_BASE=http://localhost:8000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`.

## Project Structure

- `app/pages/` - Application routes and views
- `app/components/` - Vue components
- `app/content/` - Markdown content for static pages
- `stores/` - Pinia state management
- `server/` - Nitro server routes

## System Integration

This frontend is part of the **Carlsson Spa Information System**:

- **[SpaSystem-API](file:///Users/lbert/Herd/SpaSystem-API)**: The core Laravel backend
- **[SpaCashier](file:///Users/lbert/Herd/SpaCashier)**: The management dashboard for staff

## License

This project is licensed under the MIT License.
