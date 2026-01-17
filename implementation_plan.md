# Implementation Plan - Vercel Deployment

## Goal
Deploy the secured Next.js application to **Vercel**.

## User Action Required
> [!IMPORTANT]
> **Vercel Configuration**: You will need to import the project from your Git repository into Vercel.
> **Environment Variables**: You MUST set the following variables in the Vercel Project Settings:
> - `MONGODB_URI`: Connection string to your MongoDB Atlas cluster.
> - `NEXTAUTH_SECRET`: A random string for session encryption (generate with `openssl rand -base64 32`).
> - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://your-project.vercel.app`).
> - `ADMIN_EMAIL`: Email for the default admin user.
> - `ADMIN_PASSWORD`: Password for the default admin user.
> - `ADMIN_SECRET`: Secret key for the registration API (to prevent unauthorized sign-ups).
> - `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET`: Random strings for JWT signing.

## Remaining Code Changes

### Configuration
- **[MODIFY] [next.config.mjs](file:///Users/alokanand/AllInOne/jobnext/job-next-main/next.config.mjs)**
    - Configure `remotePatterns` to allow images from common sources (like Google user profiles or placeholder services) to prevent runtime errors.

## Verification Plan

### Post-Deployment
1.  **Check Logs**: Ensure the build passes on Vercel.
2.  **Seed Admin**:
    - *Note*: Since `seed-admin.js` is a script, you might need to run it locally pointing to the PROD database, OR create a temporary API route to trigger it.
    - *Recommendation*: Use a temporary API route `/api/debug/seed` protected by `ADMIN_SECRET` to initialize the admin user on the production DB.
3.  **Smoke Test**: Login with the admin credentials.
