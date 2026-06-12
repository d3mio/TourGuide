# Ceylon Luxe Travels 🌴

A premium, full-stack web application designed for customized travel planning and luxury experiences in Sri Lanka. This platform allows users to explore destinations, plan itineraries, book experiences, and manage their trips seamlessly, offering a highly immersive and interactive UI.

## 🚀 Comprehensive Tech Stack

### Frontend Architecture
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router paradigm for Server and Client components)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/) for fast, scalable, and lightweight global state handling
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `clsx` and `tailwind-merge` for dynamic utility class management
- **Icons:** [Lucide React](https://lucide.dev/)

### Immersive UI & Animations
- **3D Rendering:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/), and [@react-three/drei](https://github.com/pmndrs/drei) for embedded 3D scenes and WebGL experiences
- **High-Performance Animations:** [GSAP](https://gsap.com/) for complex sequencing and scroll-triggered animations
- **Micro-interactions:** [Framer Motion](https://www.framer.com/motion/) & Motion for fluid page transitions and element states

### Backend & Infrastructure
- **BaaS (Backend as a Service):** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password, OAuth, Secure Sessions)
- **Storage:** Supabase Storage (for scalable media and user assets)
- **Email Delivery:** [Resend](https://resend.com/) integrated with [@react-email/components](https://react.email/) for beautifully designed, responsive transactional emails
- **Internationalization (i18n):** `next-i18next`, `react-i18next`, and `google-translate-api-x` for dynamic multilingual support
- **Deployment & Edge Network:** [Vercel](https://vercel.com/) for optimized static generation and serverless functions

---

## ✨ Key Features & Capabilities

- **Interactive 3D Experiences:** Immersive WebGL-powered 3D elements integrated directly into the DOM using React Three Fiber to showcase travel destinations.
- **Multilingual Support:** Automated, on-the-fly content translation bridging global audiences with native experiences.
- **Robust Authentication Flow:** Secure sign-up, sign-in, password reset, and profile management workflows utilizing Supabase Auth.
- **Dynamic Trip Planner:** State-managed (Zustand) itinerary planning tools allowing users to customize and save their luxury travel routes.
- **Rich Email Notifications:** Custom-built React Email templates dispatched via Resend for bookings, verifications, and itinerary confirmations.
- **Premium Aesthetics:** A fully responsive, glassmorphism-inspired UI featuring smooth GSAP/Framer Motion transitions that work flawlessly across mobile and desktop devices.
- **Performance Optimized:** Leveraging Next.js Server Components, static generation, optimized Next/Images, and minimal client-side bundles.

---

## 🛡️ Security & Architecture Methodologies

This project adheres to strict production-grade security and architectural standards:

- **Row Level Security (RLS):** All Supabase database tables are secured using strict RLS policies to ensure users can only query, insert, or modify their own authenticated data.
- **Hardened Database Grants:** The `anon` role is strictly limited to CRUD operations. DDL operations (like `TRUNCATE` or `DROP`) are strictly disabled for public roles.
- **API Route Protection:** Next.js Serverless API routes (`/api/*`) implement rigorous input validation, sanitization, and rate-limiting to prevent spam, abuse, and XSS attacks.
- **Content Security Policy (CSP):** Strict HTTP headers configured in Next.js to prevent unauthorized script execution and restrict media/data sourcing to trusted domains only.
- **Type-Driven Development:** End-to-end TypeScript enforcement guarantees API payload integrity and reduces runtime errors.
- **Component-Driven UI:** Modular architecture separating smart (stateful) components from dumb (presentational) components, maximizing reusability.
- **Secure Environment Management:** Sensitive keys, Admin contact information, and PII are abstracted into `.env.local` and accessed server-side, never leaking to the client browser.

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ceylon-luxe-travels.git
cd "Tour Guide "
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add the necessary configurations:

```env
# Public Keys (Safe for Browser)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_contact_email
NEXT_PUBLIC_ADMIN_WHATSAPP=your_admin_whatsapp_number

# Secret Keys (Server-side ONLY)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_admin_email
RESEND_API_KEY=your_resend_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

---

## 🚢 Deployment

This project is optimized for deployment on **Vercel**. 
Ensure that all environment variables from `.env.local` are accurately mapped in your Vercel project's environment settings before triggering a deployment.

```bash
# To test the build locally
npm run build

# To start the production server locally
npm run start
```

---
*Built with passion for Sri Lankan Tourism 🇱🇰*
