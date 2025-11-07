# 🚀 Quick Start - SendGrid Email Integration

## ⚡ Fast Setup (5 minutes)

### Step 1: Get SendGrid API Key
1. Go to https://signup.sendgrid.com/ (or login if you have account)
2. Settings → API Keys → Create API Key
3. Copy the key (starts with `SG.`)

### Step 2: Verify Your Email
1. Settings → Sender Authentication → Verify a Single Sender
2. Use any email you have access to
3. Click verification link in your email

### Step 3: Configure App
```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
# SENDGRID_API_KEY=SG.your_key_here
# SENDGRID_FROM_EMAIL=your_verified_email@example.com
```

### Step 4: Run Everything
```bash
npm run dev:all
```

### Step 5: Test
1. Go to http://localhost:8080
2. Click "Booking" tab
3. Fill form and complete OTP
4. Check your email! 📧

## 📖 Full Guide
See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions and troubleshooting.

## 🎯 What You Get
- ✅ Automatic email on registration
- ✅ Beautiful HTML email template
- ✅ Registration details included
- ✅ 100 free emails/day with SendGrid

## ⚙️ Commands

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Run frontend + backend together |
| `npm run dev` | Run only frontend |
| `npm run server` | Run only email server |

## 🔥 That's It!
You're ready to send emails on registration.
