# Task Checklist

- [x] Fix Critical Security Issues
    - [x] Remove double hashing and hardcoded secrets in `models/user.model.js` <!-- id: 0 -->
    - [x] Ensure robust error handling in `app/api/auth/register/route.js` <!-- id: 1 -->
    - [x] Remove backdoor auth and refactor `app/api/auth/[...nextauth]/route.js` <!-- id: 2 -->
- [ ] Deployment Preparation
    - [x] Create `lib/seed-admin.js` for safe admin initialization <!-- id: 3 -->
    - [ ] Update `next.config.mjs` for image domains <!-- id: 4 -->
    - [ ] Create `app/api/admin/seed/route.js` for remote admin seeding <!-- id: 7 -->
- [ ] Verification
    - [ ] Deploy to Vercel (User Action) <!-- id: 8 -->
    - [ ] Trigger remote seeding via API <!-- id: 9 -->
    - [ ] Test production login <!-- id: 6 -->
