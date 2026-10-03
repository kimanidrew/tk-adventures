# Tripple Tee Travellers

Modern Next.js travel website for Tripple Tee Travellers, built around the travel brand behind Instagram **@tripple_tee_travellers**.

## Stack
- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Cloudflare R2 direct browser uploads for images and videos
- Signed admin session with environment credentials
- Responsive trip catalogue, detail pages and enquiries
- Tripple Tee Travellers branding and Instagram link

## Setup

Copy .env.example to .env.local and configure DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD and the R2 variables.

Then run:

    npm install
    npx prisma generate
    npx prisma db push
    npm run db:seed
    npm run dev

Admin: /admin

R2 uploads use short-lived presigned PUT URLs. Configure the bucket CORS policy to allow PUT/GET/HEAD from your production domain and localhost during development. R2_PUBLIC_URL must point to a public R2/custom-domain URL that can serve uploaded objects.

The public brand Instagram page is:
https://www.instagram.com/tripple_tee_travellers/
