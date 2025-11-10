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
    subject: 'Molly Maid - Quotation Ready!',
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
              <h1>Molly Maid - Quotation Ready!</h1>
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
                <a href="http://localhost:8080/?user=${encodeURIComponent(email)}" class="button">Accept Quotation</a>
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
      
      Accept your quotation: http://localhost:8080/?email=${encodeURIComponent(email)}
      
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

// Payment confirmation email template
const getPaymentConfirmationEmailTemplate = (email, quotationId, service, serviceDate, customerName, amount, paymentDate) => {
  return {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Molly Maid - Payment Confirmation ${quotationId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #CF0557, #FB4D94); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .bill-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .bill-table { width: 100%; border-collapse: collapse; }
            .bill-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .bill-table tr:last-child td { border-bottom: none; padding: 15px 10px; }
            .status-badge { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Confirmation</h1>
              <p style="margin: 10px 0; font-size: 18px;">Thank you for your payment!</p>
            </div>
            <div class="content">
              <h2 style="color: #071D49;">Your Payment Receipt</h2>
              <p>Dear ${customerName},</p>
              <p>We have successfully received your payment. Below are the details of your transaction:</p>
              
              <div class="bill-details">
                <h3 style="color: #071D49; margin-top: 0;">Bill Details</h3>
                <table class="bill-table">
                  <tr>
                    <td><strong>Quotation Number:</strong></td>
                    <td>${quotationId}</td>
                  </tr>
                  <tr>
                    <td><strong>Service:</strong></td>
                    <td>${service}</td>
                  </tr>
                  <tr>
                    <td><strong>Service Date:</strong></td>
                    <td>${serviceDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Customer Name:</strong></td>
                    <td>${customerName}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Date:</strong></td>
                    <td>${paymentDate}</td>
                  </tr>
                  <tr>
                    <td><strong style="font-size: 18px;">Total Amount:</strong></td>
                    <td><strong style="font-size: 18px; color: #CF0557;">$${amount.toFixed(2)}</strong></td>
                  </tr>
                </table>
              </div>

              <div class="status-badge">
                <p style="margin: 0; color: #2e7d32;"><strong>✓ Payment Status:</strong> Paid</p>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our team will contact you to schedule your service</li>
                <li>You'll receive a confirmation call 24 hours before your appointment</li>
                <li>Keep this email as your payment receipt</li>
              </ul>

              <p style="margin-top: 30px;">If you have any questions about your payment or service, feel free to reach out to us at <a href="mailto:support@mollymaid.com" style="color: #CF0557;">support@mollymaid.com</a></p>
              
              <div class="footer">
                <p>© 2025 Molly Maid. All rights reserved.</p>
                <p>This is an automated payment confirmation email. Please keep it for your records.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Payment Confirmation
      
      Dear ${customerName},
      
      Thank you for your payment! We have successfully received your payment.
      
      Bill Details:
      - Quotation Number: ${quotationId}
      - Service: ${service}
      - Service Date: ${serviceDate}
      - Customer Name: ${customerName}
      - Payment Date: ${paymentDate}
      - Total Amount: $${amount.toFixed(2)}
      
      Payment Status: PAID
      
      What's Next?
      1. Our team will contact you to schedule your service
      2. You'll receive a confirmation call 24 hours before your appointment
      3. Keep this email as your payment receipt
      
      Questions? Contact us at support@mollymaid.com
      
      © 2025 Molly Maid. All rights reserved.
    `
  };
};

// Mr. Electric promotional email template
const getMrElectricPromotionalEmail = (email, customerName) => {
  return {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: '⚡ Special Offer from Mr. Electric - Trusted Electrical Services',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
            .header { background: linear-gradient(135deg, #003DA5 0%, #0055D4 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo-text { font-size: 32px; font-weight: bold; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
            .lightning { color: #FFD700; font-size: 40px; margin: 0 10px; }
            .content { background: #f8f9fa; padding: 30px; }
            .promo-box { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #003DA5; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .promo-text { font-size: 28px; font-weight: bold; margin: 0; text-shadow: 1px 1px 2px rgba(255,255,255,0.5); }
            .promo-code { background: white; color: #003DA5; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; margin: 15px 0; display: inline-block; border: 3px dashed #003DA5; }
            .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .service-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #003DA5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .service-icon { font-size: 30px; margin-bottom: 10px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #003DA5 0%, #0055D4 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
            .cta-button:hover { background: linear-gradient(135deg, #0055D4 0%, #0066FF 100%); }
            .trust-badge { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3; }
            .footer { text-align: center; color: #666; margin-top: 30px; padding: 20px; border-top: 2px solid #ddd; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo-text">
                <span class="lightning">⚡</span>
                Mr. Electric
                <span class="lightning">⚡</span>
              </h1>
              <p style="margin: 10px 0; font-size: 18px;">Trusted Electrical Services Since 1994</p>
            </div>
            
            <div class="content">
              <h2 style="color: #003DA5; margin-top: 0;">Dear ${customerName},</h2>
              
              <p>Thank you for choosing Molly Maid! We hope you're enjoying your clean home. 🏠</p>
              
              <p>As part of the <strong>Neighborly family of brands</strong>, we're excited to introduce you to <strong>Mr. Electric</strong> - your trusted partner for all electrical needs!</p>

              <div class="promo-box">
                <p class="promo-text">EXCLUSIVE OFFER</p>
                <h2 style="margin: 15px 0; color: #003DA5;">20% OFF Your First Service!</h2>
                <div class="promo-code">ELECTRIC20</div>
                <p style="margin: 10px 0; font-size: 14px;">Valid for 60 days • No hidden fees</p>
              </div>

              <div class="trust-badge">
                <p style="margin: 0; color: #1565C0;">
                  <strong>✓ Licensed & Insured</strong> | 
                  <strong>✓ On-Time Service</strong> | 
                  <strong>✓ Background-Checked Electricians</strong>
                </p>
              </div>

              <h3 style="color: #003DA5;">Our Expert Services Include:</h3>
              
              <div class="services-grid">
                <div class="service-card">
                  <div class="service-icon">💡</div>
                  <h4 style="margin: 10px 0; color: #003DA5;">Lighting Solutions</h4>
                  <p style="font-size: 14px; margin: 5px 0;">Interior & exterior lighting installation and repair</p>
                </div>
                
                <div class="service-card">
                  <div class="service-icon">🔌</div>
                  <h4 style="margin: 10px 0; color: #003DA5;">Outlet & Switch Repair</h4>
                  <p style="font-size: 14px; margin: 5px 0;">Safe installation of outlets, switches & USB ports</p>
                </div>
                
                <div class="service-card">
                  <div class="service-icon">⚙️</div>
                  <h4 style="margin: 10px 0; color: #003DA5;">Panel Upgrades</h4>
                  <p style="font-size: 14px; margin: 5px 0;">Electrical panel modernization & circuit breakers</p>
                </div>
                
                <div class="service-card">
                  <div class="service-icon">🔋</div>
                  <h4 style="margin: 10px 0; color: #003DA5;">Generator Installation</h4>
                  <p style="font-size: 14px; margin: 5px 0;">Backup power solutions for your home</p>
                </div>
                
                <div class="service-card">
                  <div class="service-icon">🏡</div>
                  <h4 style="margin: 10px 0; color: #003DA5;">Home Inspections</h4>
                  <p style="font-size: 14px; margin: 5px 0;">Comprehensive electrical safety checks</p>
                </div>
                
                <div class="service-card">
                  <div class="service-icon">🚨</div>
                  <h4 style="margin: 10px 0; color: #003DA5;">Emergency Services</h4>
                  <p style="font-size: 14px; margin: 5px 0;">24/7 emergency electrical repairs</p>
                </div>
              </div>

              <h3 style="color: #003DA5;">Why Choose Mr. Electric?</h3>
              <ul style="line-height: 2;">
                <li>⚡ <strong>Same-Day Service Available</strong> - We work around your schedule</li>
                <li>🎓 <strong>Expert Electricians</strong> - Highly trained & certified professionals</li>
                <li>💯 <strong>Neighborly Done Right Promise</strong> - We guarantee your satisfaction</li>
                <li>🛡️ <strong>Safety First</strong> - All work meets current electrical codes</li>
                <li>💰 <strong>Upfront Pricing</strong> - No surprises, no hidden fees</li>
              </ul>

              <center>
                <a href="http://localhost:8081" class="cta-button">
                  ⚡ Schedule Your Service Now ⚡
                </a>
              </center>

              <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #856404; margin-top: 0;">🎁 Special Neighborly Customer Bonus!</h4>
                <p style="color: #856404; margin: 5px 0;">Use code <strong>ELECTRIC20</strong> at checkout to receive 20% off your first electrical service. Don't wait - this exclusive offer is only valid for 60 days!</p>
              </div>

              <p style="margin-top: 30px;">Have questions? Our friendly team is ready to help!</p>
              <p>
                📞 Call us at <strong style="color: #003DA5;">1-888-MRELECTRIC</strong><br>
                🌐 Visit us at <a href="http://localhost:8081" style="color: #003DA5;">mrelectric.com</a><br>
                📧 Email us at <a href="mailto:info@mrelectric.com" style="color: #003DA5;">info@mrelectric.com</a>
              </p>
              
              <div class="footer">
                <p style="margin: 10px 0;">
                  <strong style="color: #003DA5;">Mr. Electric</strong><br>
                  Part of the Neighborly® family of home service brands
                </p>
                <p style="margin: 10px 0; font-size: 11px;">
                  © 2025 Mr. Electric. All rights reserved.<br>
                  Licensed, Bonded & Insured | Independently Owned and Operated
                </p>
                <p style="margin: 10px 0; font-size: 10px; color: #999;">
                  This promotional email is sent to valued Neighborly customers.<br>
                  You received this because you recently used services from Molly Maid.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Mr. Electric - Trusted Electrical Services
      
      Dear ${customerName},
      
      Thank you for choosing Molly Maid! We hope you're enjoying your clean home.
      
      As part of the Neighborly family of brands, we're excited to introduce you to Mr. Electric - your trusted partner for all electrical needs!
      
      EXCLUSIVE OFFER: 20% OFF Your First Service!
      Use code: ELECTRIC20
      Valid for 60 days
      
      Our Expert Services Include:
      - Lighting Solutions (Interior & exterior)
      - Outlet & Switch Repair
      - Panel Upgrades & Circuit Breakers
      - Generator Installation
      - Home Electrical Inspections
      - 24/7 Emergency Services
      
      Why Choose Mr. Electric?
      ✓ Same-Day Service Available
      ✓ Expert, Certified Electricians
      ✓ Neighborly Done Right Promise
      ✓ Safety First - Code Compliant
      ✓ Upfront Pricing - No Hidden Fees
      
      Schedule your service: http://localhost:8081
      Call us: 1-888-MRELECTRIC
      Email: info@mrelectric.com
      
      Don't wait - use code ELECTRIC20 for 20% off your first service!
      
      © 2025 Mr. Electric - Part of the Neighborly® family
      Licensed, Bonded & Insured
    `
  };
};

// API endpoint to send payment confirmation email
app.post('/api/send-payment-confirmation', async (req, res) => {
  try {
    const { email, quotationId, service, serviceDate, customerName, amount, paymentDate } = req.body;

    // Validate required fields
    if (!email || !quotationId || !service || !customerName || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Prepare email
    const paymentMsg = getPaymentConfirmationEmailTemplate(
      email, 
      quotationId, 
      service, 
      serviceDate, 
      customerName, 
      amount, 
      paymentDate
    );

    // Prepare Mr. Electric promotional email
    const promoMsg = getMrElectricPromotionalEmail(email, customerName);

    // Send both emails via SendGrid
    await Promise.all([
      sgMail.send(paymentMsg),
      sgMail.send(promoMsg)
    ]);

    console.log(`✅ Payment confirmation email sent to: ${email}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Payment confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error.response?.body || error.message);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send payment confirmation email',
      details: error.message 
    });
  }
});

// Appointment confirmation email template
const getAppointmentConfirmationEmailTemplate = (email, appointmentId, quotationId, service, amount, appointmentDate, appointmentTime, customerName, phoneNumber) => {
  const paymentLink = `http://localhost:8080/payments?appointment=${appointmentId}`;
  
  return {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Molly Maid - Appointment Confirmed ${appointmentId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #CF0557, #FB4D94); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-table { width: 100%; border-collapse: collapse; }
            .detail-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .detail-table tr:last-child td { border-bottom: none; }
            .payment-section { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800; }
            .button { display: inline-block; background: linear-gradient(to right, #CF0557, #FB4D94); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Appointment Confirmed!</h1>
              <p style="margin: 10px 0; font-size: 18px;">Your service is scheduled</p>
            </div>
            <div class="content">
              <h2 style="color: #071D49;">Dear ${customerName},</h2>
              <p>Great news! Your appointment has been confirmed. Here are the details:</p>
              
              <div class="appointment-details">
                <h3 style="color: #071D49; margin-top: 0;">Appointment Details</h3>
                <table class="detail-table">
                  <tr>
                    <td><strong>Appointment ID:</strong></td>
                    <td>${appointmentId}</td>
                  </tr>
                  <tr>
                    <td><strong>Quotation Number:</strong></td>
                    <td>${quotationId}</td>
                  </tr>
                  <tr>
                    <td><strong>Service:</strong></td>
                    <td>${service}</td>
                  </tr>
                  <tr>
                    <td><strong>Date:</strong></td>
                    <td>${appointmentDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Time:</strong></td>
                    <td>${appointmentTime}</td>
                  </tr>
                  <tr>
                    <td><strong>Customer Name:</strong></td>
                    <td>${customerName}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>${phoneNumber}</td>
                  </tr>
                  <tr>
                    <td><strong style="font-size: 18px;">Service Amount:</strong></td>
                    <td><strong style="font-size: 18px; color: #CF0557;">$${amount.toFixed(2)}</strong></td>
                  </tr>
                </table>
              </div>

              <div class="payment-section">
                <h3 style="color: #e65100; margin-top: 0;">⚠️ Payment Required</h3>
                <p>To secure your appointment, please complete the payment at your earliest convenience.</p>
                <p style="text-align: center;">
                  <a href="${paymentLink}" class="button">Complete Payment Now</a>
                </p>
                <p style="font-size: 12px; color: #666; margin: 0;">
                  Click the button above or copy this link to your browser:<br/>
                  <code style="background: white; padding: 5px; border-radius: 3px; display: inline-block; margin-top: 5px;">${paymentLink}</code>
                </p>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Complete your payment using the link above</li>
                <li>You'll receive a confirmation call 24 hours before your appointment</li>
                <li>Our team will arrive at the scheduled time</li>
                <li>Keep this email for your records</li>
              </ul>

              <p style="margin-top: 30px;">If you need to reschedule or have any questions, please contact us at <a href="mailto:support@mollymaid.com" style="color: #CF0557;">support@mollymaid.com</a> or call us at (555) 123-4567.</p>
              
              <div class="footer">
                <p>© 2025 Molly Maid. All rights reserved.</p>
                <p>This is an automated appointment confirmation email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Appointment Confirmed!
      
      Dear ${customerName},
      
      Great news! Your appointment has been confirmed.
      
      Appointment Details:
      - Appointment ID: ${appointmentId}
      - Quotation Number: ${quotationId}
      - Service: ${service}
      - Date: ${appointmentDate}
      - Time: ${appointmentTime}
      - Customer Name: ${customerName}
      - Phone: ${phoneNumber}
      - Service Amount: $${amount.toFixed(2)}
      
      Payment Required:
      To secure your appointment, please complete the payment at your earliest convenience.
      Payment Link: ${paymentLink}
      
      What's Next?
      1. Complete your payment using the link above
      2. You'll receive a confirmation call 24 hours before your appointment
      3. Our team will arrive at the scheduled time
      4. Keep this email for your records
      
      Questions? Contact us at support@mollymaid.com or call (555) 123-4567.
      
      © 2025 Molly Maid. All rights reserved.
    `
  };
};

// Appointment confirmation endpoint
app.post('/api/send-appointment-confirmation', async (req, res) => {
  try {
    const { email, appointmentId, quotationId, service, amount, appointmentDate, appointmentTime, customerName, phoneNumber } = req.body;

    // Validate required fields
    if (!email || !appointmentId || !quotationId || !service || !amount || !appointmentDate || !appointmentTime || !customerName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Prepare email
    const appointmentMsg = getAppointmentConfirmationEmailTemplate(
      email, 
      appointmentId, 
      quotationId, 
      service, 
      amount, 
      appointmentDate, 
      appointmentTime, 
      customerName, 
      phoneNumber
    );

    // Send email via SendGrid
    await sgMail.send(appointmentMsg);

    console.log(`✅ Appointment confirmation email sent to: ${email} for appointment ${appointmentId}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Appointment confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error sending appointment confirmation email:', error.response?.body || error.message);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send appointment confirmation email',
      details: error.message 
    });
  }
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
