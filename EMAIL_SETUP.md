# SendGrid Email Integration Setup Guide

This guide will help you set up SendGrid to send registration emails automatically.

## 📋 Prerequisites

- A SendGrid account (free tier is fine)
- A verified sender email address

## 🚀 Setup Steps

### 1. Create SendGrid Account

1. Go to [SendGrid](https://signup.sendgrid.com/)
2. Sign up for a free account (100 emails/day)
3. Verify your email address

### 2. Create API Key

1. Log in to [SendGrid Console](https://app.sendgrid.com/)
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it (e.g., "Molly Maid App")
5. Select **Full Access** or **Restricted Access** with Mail Send permissions
6. Click **Create & View**
7. **Copy the API key** (you won't see it again!)

### 3. Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - From Name: `Molly Maid`
   - From Email Address: Your email (e.g., `noreply@yourdomain.com`)
   - Reply To: Same or support email
   - Company details
4. Check your email and click the verification link

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   PORT=3001
   ```

   Replace:
   - `SENDGRID_API_KEY` with your API key from step 2
   - `SENDGRID_FROM_EMAIL` with your verified sender email from step 3

### 5. Run the Application

#### Option A: Run Frontend and Backend Together (Recommended)
```bash
npm run dev:all
```

This runs:
- Frontend (Vite): http://localhost:8080
- Email Server (Express): http://localhost:3001

#### Option B: Run Separately
Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run server
```

## ✅ Testing

1. Go to http://localhost:8080
2. Navigate to **Booking** tab
3. Fill in the registration form:
   - Email: Your email address
   - Zip Code: Any zip code
   - Address: Any address
4. Submit the form and verify OTP
5. Check your inbox for the welcome email! 📧

## 📧 Email Template

The registration email includes:
- ✅ Professional branded design
- ✅ Registration details (email, address, zip code)
- ✅ Next steps information
- ✅ Link to dashboard
- ✅ HTML and plain text versions

## 🔧 Customization

### Modify Email Template

Edit `server/index.js` → `getRegistrationEmailTemplate()` function to customize:
- Subject line
- HTML design
- Email content
- Links and CTAs

### Change Email Server Port

Edit `.env`:
```env
PORT=3001  # Change to your preferred port
```

## 🐛 Troubleshooting

### Email Not Sending?

1. **Check API Key**: Make sure it's copied correctly in `.env`
2. **Verify Sender**: Ensure your sender email is verified in SendGrid
3. **Check Logs**: Look at server console for error messages
4. **SendGrid Dashboard**: Check Activity Feed for delivery status

### Server Not Starting?

1. Check if port 3001 is already in use
2. Make sure all dependencies are installed: `npm install`
3. Verify `.env` file exists with correct variables

### CORS Errors?

The server is configured to accept requests from any origin. If you need to restrict:

Edit `server/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:8080'
}));
```

## 📊 SendGrid Free Tier Limits

- **100 emails/day** - Perfect for development and testing
- **2,000 contacts**
- **Email validation**
- **Detailed analytics**

## 🔒 Security Notes

- ✅ Never commit `.env` file to git (already in `.gitignore`)
- ✅ Keep your API key secret
- ✅ Use environment variables for all sensitive data
- ✅ Rotate API keys periodically

## 📚 Resources

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
- [Email Best Practices](https://sendgrid.com/resource/email-best-practices/)

## 🎉 Next Steps

Once emails are working:
1. Customize the email template with your branding
2. Add more email types (password reset, appointment confirmation, etc.)
3. Set up email tracking and analytics
4. Consider upgrading SendGrid plan for higher volume

---

Need help? Check the server logs or SendGrid Activity Feed for detailed error messages.
