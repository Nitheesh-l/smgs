# Deployment Guide for SMGS

Deploy your project securely without exposing secrets. This guide covers two main approaches: **Vercel (recommended)** and **alternative platforms**.

---

## Prerequisites

- Git repository pushed to GitHub (✅ done)
- Real MongoDB Atlas URI
- Generate a strong JWT secret (e.g., `openssl rand -base64 32` or use an online generator)
- Credentials for deployment platform

---

## Option 1: Vercel (Recommended)

Vercel works well for both frontend and backend. You'll create two separate projects.

### 1.1 Deploy Server (Backend)

> **TypeScript dependencies:** ensure `@types/cors` (and any other `@types/*`) are listed under `dependencies` in `server/package.json`, not just `devDependencies`. This prevents build failures on Vercel.
>
> You can add it with:
> ```bash
> cd server
> npm install @types/cors
> git add package.json package-lock.json && git commit -m "chore: add @types/cors dependency" && git push
> ```

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your server repo (`smgs-backend`)
4. **Configure:**
   - Framework: **Other** (Node.js)
   - Root Directory: `./` (or set to `server` if you imported the top‑level repo)
   - Build Command: (leave empty or `echo 'No build needed'`)
   - **Output Directory:** _none_. If Vercel prompts for an output
directory or complains about `public`, you have selected the wrong
project type – backend projects don’t produce static files. The error
"No Output Directory named 'public' found" means the deployment is
trying to build a static site; instead create a separate project for
the frontend and use `framework: Vite` there.

> **Note:** only one `vercel.json` file should exist, and it must live at the
> root of the backend repo (e.g. `server/vercel.json`). Earlier versions
> accidentally placed a second, commented file under `src/`, which caused the
> "Invalid vercel.json" message. That file was removed in a cleanup commit.
5. Click **"Environment Variables"** and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   JWT_SECRET=your_long_random_secret_here
   NODE_ENV=production
   ```
6. Click **"Deploy"**
7. After deployment, copy the URL (e.g., `https://smgs-backend.vercel.app`)

### 1.2 Deploy Client (Frontend)

1. In Vercel, click **"Add New..."** → **"Project"**
2. Import your client repo (`smgs-frontend`)
3. **Configure:**
   - Framework: **Vite**
   - Root Directory: `./` (or leave blank if at root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **"Environment Variables"** and add:
   ```
   VITE_API_BASE=https://smgs-backend.vercel.app
   ```
   (Replace with your actual server URL)
5. Click **"Deploy"**
6. After deployment, you'll get a live URL (e.g., `https://smgs-frontend.vercel.app`)

### 1.3 Update Client to Use Server URL

Ensure your client code calls the server API. Update [client/src/utils/api.ts](client/src/utils/api.ts) or wherever API calls are made:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function fetchJson(
  url: string,
  options?: RequestInit
): Promise<{ res: Response; data: any }> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  // ... rest of fetch logic
}
```

Then in your components/API calls:
```typescript
// Automatically uses the deployed server URL in production
const { res, data } = await fetchJson('/api/auth/signin', { ... });
```

---

## Option 2: Render + Netlify

Separate platforms for more control.

### 2.1 Deploy Server to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"Create +"** → **"Web Service"**
3. Connect your GitHub repo (`smgs-backend`)
4. **Configure:**
   - Name: `smgs-backend`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `node dist/index.js`
5. Add **Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=...
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**
7. Copy the deployed URL (e.g., `https://smgs-backend.onrender.com`)

### 2.2 Deploy Client to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repo (`smgs-frontend`)
4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add **Environment Variables:**
   ```
   VITE_API_BASE=https://smgs-backend.onrender.com
   ```
6. Click **"Deploy site"**
7. You'll get a live URL (e.g., `https://smgs-frontend.netlify.app`)

---

## Option 3: Railway or Fly.io (Simple & Fast)

### 3.1 Deploy Both on Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project → **"Deploy from GitHub"**
3. Select your repo and branch

**For Server:**
- Add environment variables in Railway dashboard
- Railway auto-detects `package.json` and runs `npm start`

**For Client:**
- Add a second service for the frontend
- Set build command: `npm run build`
- Set output directory: `dist`

---

## Admin Setup & Faculty Management

After deploying the backend, you need to create the initial super admin account:

### Step 1: Run Admin Seed Script (Local)

Run this locally in your server directory:

```bash
cd server
npm run seed:admin
```

This creates an admin account with:
- Email: `admin@smgs.com`
- Password: `Admin@123456`

**⚠️ Important:** Change this password immediately after logging in on production!

### Step 2: Access Admin Dashboard

1. Go to your frontend URL
2. Click "Faculty Login" (note: faculty only login)
3. Enter admin credentials:
   - Email: `admin@smgs.com`
   - Password: `Admin@123456`
4. You'll be redirected to the **Admin Dashboard** at `/admin`

### Step 3: Create Faculty Accounts

Admins can now use the admin dashboard to:
- Create faculty accounts by entering faculty name, email, and password
- Verify with their admin password
- Faculty accounts cannot be created via signup (disabled for security)

---

## Security Checklist

- [ ] `.env` file is locally-only and in `.gitignore`
- [ ] Environment variables are set in the deployment platform UI (NOT in code)
- [ ] `MONGODB_URI` and `JWT_SECRET` never appear in client bundle
- [ ] Server responds with `Access-Control-Allow-Origin: *` (or specific domain) for CORS
- [ ] HTTPS is enabled on deployed URLs
- [ ] Rotate MongoDB and JWT secrets if they were ever exposed
- [ ] Admin account password changed from default (`Admin@123456`)


---

## Verify Deployment

After deploying both:

1. **Test Server API:**
   ```bash
   curl https://your-backend-url.com/health
   # Should return: {"status":"OK"}
   ```

2. **Test Client:**
   - Open your frontend URL in browser
   - Open DevTools → Network tab
   - Try signing in or any API call
   - Confirm requests go to your deployed backend URL

3. **Check Client Bundle for Secrets:**
   ```bash
   cd client
   npm run build
   grep -r "mongodb" dist/ || echo "✅ No MongoDB URI in bundle"
   grep -r "JWT_SECRET" dist/ || echo "✅ No JWT secret in bundle"
   ```

---

## Troubleshooting

**"API calls fail with CORS error"**
- Add CORS headers in `server/src/index.ts`:
  ```typescript
  app.use(cors({
    origin: 'https://your-frontend-url.com', // Or '*' for testing
    credentials: true,
  }));
  ```

**"Environment variables not loading"**
- Restart the deployment after adding env vars
- Verify vars are set in platform UI (Settings → Environment)

**"Build fails on Vercel"**
- Ensure `package.json` is in the root of the repo
- Check build logs in Vercel dashboard

---

## Manual Deployment (No Domain)

If you want to use temporary URLs without a domain:
- Vercel: `https://[project-name]-[hash].vercel.app`
- Render: `https://[project-name].onrender.com`
- Railway: `https://[project-name]-[random].railway.app`
- Netlify: `https://[project-name]-[hash].netlify.app`

These are permanent URLs (unless you delete the project). No custom domain needed.

---

## Next Steps

1. Choose a platform (Vercel recommended)
2. Deploy server first, copy the URL
3. Deploy client with `VITE_API_BASE` set to server URL
4. Test both services
5. Rotate MongoDB and JWT secrets if they were ever committed

Done! Your project is now live. 🚀
