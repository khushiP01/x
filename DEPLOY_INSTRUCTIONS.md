# Vercel Deployment Instructions

## Quick Deploy via Web Interface

### Step 1: Ensure Code is on GitHub
Your repository: https://github.com/khushiP01/x

### Step 2: Deploy to Vercel

1. **Visit Vercel**: https://vercel.com/new

2. **Import Repository**:
   - Sign in with GitHub
   - Click "Import Git Repository"
   - Find and select `khushiP01/x`

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`

4. **Environment Variables** (IMPORTANT):
   Add the following environment variable:
   
   ```
   BASEHUB_TOKEN=bshb_pk_h91z7v9jlfsgkt4o4vnsim79jtm8lazstd5dsehdhskjouidzstiz0hwulkykdnd
   ```
   
   Apply to: Production, Preview, and Development

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Get your live URL: `https://x-[random].vercel.app`

---

## Alternative: CLI Deployment

If you prefer command line:

```bash
cd /Users/khushipuri/Desktop/x

# Login to Vercel (opens browser)
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? x (or custom name)
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add BASEHUB_TOKEN production
# Paste: bshb_pk_h91z7v9jlfsgkt4o4vnsim79jtm8lazstd5dsehdhskjouidzstiz0hwulkykdnd

vercel env add BASEHUB_TOKEN preview
# Paste token again

# Deploy to production
vercel --prod
```

---

## After Deployment

1. **Visit your site**: Vercel will provide a URL
2. **Test functionality**:
   - Homepage loads
   - Blog works
   - Changelog works
   - Dark/light mode toggle
   - Search functionality

3. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration steps

---

## Troubleshooting

### Build fails
- Check that `BASEHUB_TOKEN` is set correctly
- Verify token has access to your BaseHub repository

### Content not loading
- Ensure BaseHub token is valid
- Check that token is added to all environments (Production, Preview, Development)

### Deployment successful but site shows errors
- Check Vercel logs: Project → Deployments → Click deployment → Function Logs
- Verify environment variables are set

---

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel remove [project-name]
```


