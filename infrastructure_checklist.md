# Infrastructure Checklist: Vercel Custom Domain Configuration

To link your custom domain (`ceylonluxetravels.com`) to your Vercel deployment, please follow these steps:

## 1. Add Domain to Vercel
1. Go to your project dashboard on [Vercel](https://vercel.com).
2. Click on the **Settings** tab.
3. Select **Domains** from the left sidebar.
4. Enter `ceylonluxetravels.com` in the input field and click **Add**.
5. Vercel will prompt you to choose whether to add `www.ceylonluxetravels.com` and redirect it. Select **Add and Redirect** to ensure both work.

## 2. Configure DNS Records
Vercel will provide you with DNS records to add to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare).
Typically, this involves:
- **A Record**:
  - Name: `@`
  - Value: `76.76.21.21`
- **CNAME Record** (for www):
  - Name: `www`
  - Value: `cname.vercel-dns.com`

Wait for the DNS propagation. Vercel's dashboard will show a checkmark when the domain is verified.

## 3. Update Environment Variables in Vercel
In your Vercel Project Settings > **Environment Variables**, update or add:
- `NEXT_PUBLIC_SITE_URL=https://ceylonluxetravels.com`

## 4. Update Supabase Authentication Configuration
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** > **URL Configuration**.
3. Set the **Site URL** to `https://ceylonluxetravels.com`.
4. Under **Redirect URLs**, add `https://ceylonluxetravels.com/**` to allow redirects to any path on your domain.

## 5. Update Google OAuth Consent Screen
1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Navigate to **APIs & Services** > **Credentials**.
3. Edit your **OAuth 2.0 Client ID**.
4. Under **Authorized JavaScript origins**, add `https://ceylonluxetravels.com`.
5. Under **Authorized redirect URIs**, add `https://ceylonluxetravels.com/auth/callback` (or your specific Supabase callback URL).
6. Save the changes.
