# Ceylon Luxe Travels 🌴

A premium, full-stack web application designed for customized travel planning and luxury experiences in Sri Lanka. This platform allows users to explore destinations, plan itineraries, book experiences, and manage their trips seamlessly.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend & Infrastructure
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (Google OAuth & Email/Password)
- **Storage:** Supabase Storage (for media and assets)
- **Email Delivery:** [Resend](https://resend.com/) (via Custom SMTP and API)
- **External APIs:** Google Cloud Translation API (for automated content translation)
- **Deployment:** [Vercel](https://vercel.com/)

---

## ✨ Key Features

- **Robust Authentication:** Secure Sign Up, Sign In, and Password Reset flows utilizing Supabase Auth.
- **Dynamic Exploration:** Interactive pages to discover Sri Lankan culture, travel pillars, and personalized experiences.
- **Trip Planner:** Automated and customizable itinerary planning tools for users.
- **Translation Services:** Integrated Google Translate API for multilingual support.
- **Responsive Design:** A fully responsive, glassmorphism-inspired UI that works flawlessly across mobile and desktop devices.
- **Performance Optimized:** Statically generated pages, optimized images via Next.js `next/image`, and strict Content Security Policies.

---

## 🛡️ Security & Architecture Methodologies

This project adheres to strict production-grade security standards:

- **Row Level Security (RLS):** All database tables are secured using Supabase RLS policies to ensure users can only access their own data.
- **Hardened Database Grants:** The `anon` role is strictly limited to CRUD (`SELECT, INSERT, UPDATE, DELETE`) operations. DDL operations (like `TRUNCATE`) are disabled for public roles.
- **API Protection:** All Next.js API routes (`/api/book`, `/api/translate`) implement rigorous input sanitization and rate-limiting to prevent spam, abuse, and XSS attacks.
- **Content Security Policy (CSP):** Strict HTTP headers are configured in `next.config.ts` to prevent unauthorized script execution and restrict media sourcing.
- **Environment Variable Management:** All sensitive keys, Admin contact information, and PII are abstracted into `.env.local` and never hardcoded into the repository.

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
Create a `.env.local` file in the root directory and add the following keys:

```env
# Public Keys
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_contact_email
NEXT_PUBLIC_ADMIN_WHATSAPP=your_admin_whatsapp_number

# Secret Keys (Do not expose to the browser)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_admin_email
RESEND_API_KEY=your_resend_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚢 Deployment

This project is optimized for deployment on **Vercel**. 
Ensure that all environment variables from `.env.local` are added to your Vercel project settings before deploying.

```bash
# To build locally
npm run build

# To start the production server locally
npm run start
```
