# Neighborly Demo App

A multi-brand demo application showcasing service provider platforms with authentication, booking management, and payment processing capabilities. This project demonstrates two separate brand experiences: **Molly Maid** (cleaning services) and **Mr. Electric** (electrical services).

Use cases:

1. Registration via Self Registration flow feature with Email verification.
2. SSO & Multi Attribute Login.
3. ACR based Step up authentication.
4. Geo Anomaly detection via Sift.

## 🚀 Features

1. Molly Maid App
2. Mr. Electric App
3. Backend server for email sending and pdf generation.

## 📋 Prerequisites

- Node.js 22 or above
- Asgardeo account for authentication configuration
- SendGrid API key for email functionality (optional)

## 🛠️ Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd neighborly-demo

# Install dependencies
npm install
```

## ⚙️ Configuration

Before running the application, configure the following:

### 1. Asgardeo Setup

#### Molly Maid: Update the Asgardeo configuration in `src/config/asgardeo.config.ts`:

```typescript
export const asgardeoConfig = {
  signInRedirectURL: "http://localhost:8080",
  signOutRedirectURL: "http://localhost:8080",
  clientID: "YOUR_CLIENT_ID_MOLLY_MAID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG",
  scope: ["openid", "profile", "email", "phone", "internal_login"],
  storage: "sessionStorage",
  enablePKCE: true,
  disableTrySignInSilently: false,
};
```

#### Mr Electric: Update the Asgardeo configuration in `src/config/mrelectric.config.ts`:

```typescript
export const asgardeoConfig = {
  signInRedirectURL: "http://localhost:8081",
  signOutRedirectURL: "http://localhost:8081",
  clientID: "YOUR_CLIENT_ID_MR_ELECTRIC",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG",
  scope: ["openid", "profile", "email", "phone", "internal_login"],
  storage: "sessionStorage",
  enablePKCE: true,
  disableTrySignInSilently: false,
};
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_sendgrid_from_email
```

## 🚀 Running the Application

Choose one of the following commands based on your needs:

### Development Mode

```sh
# Run Molly Maid app (port 8080)
npm run dev

# Run Mr. Electric app (port 8081)
npm run dev:mr-electric

# Run backend server (port 3001)
npm run server

# Run both apps + server
npm run dev:all
```

## 🌐 Access URLs

- **Molly Maid App**: http://localhost:8080
- **Mr. Electric App**: http://localhost:8081
- **Backend Server**: http://localhost:3001

## 🏗️ Project Structure

```text
neighborly-demo/
├── src/
│   ├── components/
│   │   ├── molly-maid/       # Molly Maid components
│   │   └── mr-electric/      # Mr. Electric components
│   ├── config/               # Asgardeo Configuration files
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── pages/                # Main app pages
│   └── services/             # API and service integrations
├── server/                   # Express backend server
│   ├── index.js             # Server entry point
│   ├── pdfGenerator.js      # PDF generation service
│   └── test-payment-email.js
├── public/                   # Static assets
├── docs/                     # Documentation
└── temp-pdfs/               # Temporary PDF storage
```

## 🛠️ Technologies

This project uses modern web development technologies and tools.

### Frontend

- **Vite** - Build tool and dev server
- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Asgardeo Auth React** - Authentication
- **React Hook Form** - Form management

### Backend

- **Express** - Web server
- **PDFKit** - PDF generation
- **SendGrid** - Email service
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request parsing

## 📄 Key Services

The application includes several key services for handling various functionalities:

### Authentication (`useAsgardeoApi.ts`)

Manages user authentication, session handling, and user profile data using Asgardeo.

### Email Service (`emailService.ts`)

Handles registration emails and notifications using SendGrid.

### Mobile Verification (`mobileVerificationService.ts`)

Manages mobile number verification and OTP functionality.

### Payment Storage (`paymentStorage.ts`)

Handles payment data persistence and retrieval.

### SCIM Service (`scimService.ts`)

Manages user profile updates via SCIM API.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is for testing purposes.
