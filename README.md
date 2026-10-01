# TK Adventures

Modern Next.js travel agency website for TK Adventures, a Nairobi-based travel and tour agency.

## Stack
- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Cloudflare R2 direct browser uploads for images and videos
- Signed admin session with environment credentials
- Responsive travel catalogue, detail pages and enquiries
- Transparent TK Adventures logo generated from the supplied logo image and used as navbar mark + favicon

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

Example CORS:

    [
      {
        "AllowedOrigins": ["https://www.tkadventures.co.ke", "http://localhost:3000"],
        "AllowedMethods": ["GET", "PUT", "HEAD"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["ETag"]
      }
    ]
