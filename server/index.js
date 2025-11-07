import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs';
import { generateQuotationPDF, cleanupOldPDFs } from './pdfGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email template for registration
const getRegistrationEmailTemplate = (email, address, zipCode) => {
  return {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL, // Must be verified sender in SendGrid
    subject: 'Welcome to Molly Maid - Your Quotation is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #CF0557, #FB4D94); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(to right, #CF0557, #FB4D94); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-left: 4px solid #CF0557; margin: 20px 0; }
            .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 Welcome to Molly Maid!</h1>
            </div>
            <div class="content">
              <h2>Thank you for choosing Molly Maid!</h2>
              <p>We're excited to help you with your cleaning needs. Your quotation request has been received and is being processed.</p>
              
              <div style="background: #FFF3CD; border-left: 4px solid #FFC107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #856404;">
                  <strong>📎 PDF Quotation Attached</strong><br>
                  Your detailed quotation is attached to this email as a PDF file. Please review it carefully.
                </p>
              </div>
              
              <div class="details">
                <h3 style="color: #071D49; margin-top: 0;">📋 Your Request Details:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Zip Code:</strong> ${zipCode}</p>
                <p><strong>Status:</strong> <span style="color: #CF0557;">Under Review</span></p>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our team will review your request within 24 hours</li>
                <li>You'll receive a detailed quotation via email</li>
                <li>You can accept or modify the quotation through your dashboard</li>
              </ul>

              <center>
                <a href="http://localhost:8080/dashboard" class="button">View Dashboard</a>
              </center>

              <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@mollymaid.com" style="color: #CF0557;">support@mollymaid.com</a></p>
              
              <div class="footer">
                <p>© 2025 Molly Maid. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Molly Maid!
      
      Thank you for choosing Molly Maid! We're excited to help you with your cleaning needs.
      
      Your Request Details:
      - Email: ${email}
      - Address: ${address}
      - Zip Code: ${zipCode}
      - Status: Under Review
      
      What's Next?
      1. Our team will review your request within 24 hours
      2. You'll receive a detailed quotation via email
      3. You can accept or modify the quotation through your dashboard
      
      View your dashboard: http://localhost:8080/dashboard
      
      Questions? Contact us at support@mollymaid.com
      
      © 2025 Molly Maid. All rights reserved.
    `
  };
};

// API endpoint to send registration email
app.post('/api/send-registration-email', async (req, res) => {
  try {
    const { email, address, zipCode } = req.body;

    // Validate required fields
    if (!email || !address || !zipCode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: email, address, zipCode' 
      });
    }

    // Generate PDF quotation
    console.log('📄 Generating PDF quotation...');
    const pdfPath = await generateQuotationPDF(email, address, zipCode);
    console.log('✅ PDF generated:', pdfPath);

    // Read PDF file as base64
    const pdfContent = fs.readFileSync(pdfPath).toString('base64');

    // Prepare email
    const msg = getRegistrationEmailTemplate(email, address, zipCode);
    
    // Add PDF attachment
    msg.attachments = [
      {
        content: pdfContent,
        filename: 'Molly_Maid_Quotation.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ];

    // Send email via SendGrid
    await sgMail.send(msg);

    console.log(`✅ Registration email sent to: ${email}`);
    
    // Delete the temporary PDF file
    fs.unlinkSync(pdfPath);
    console.log('🗑️  Temporary PDF deleted');
    
    res.status(200).json({ 
      success: true, 
      message: 'Registration email sent successfully with PDF quotation' 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email service is running' });
});

app.listen(PORT, () => {
  console.log(`📧 Email server running on http://localhost:${PORT}`);
  console.log(`✅ SendGrid API key configured: ${process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}`);
  console.log(`✅ From email configured: ${process.env.SENDGRID_FROM_EMAIL || 'Not set'}`);
  console.log(`📄 PDF generation enabled`);
  
  // Cleanup old PDFs every hour
  setInterval(() => {
    cleanupOldPDFs();
  }, 60 * 60 * 1000);
});
