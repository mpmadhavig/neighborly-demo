import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateQuotationPDF = async (email, address, zipCode) => {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF directory if it doesn't exist
      const pdfDir = path.join(process.cwd(), 'temp-pdfs');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      const filename = `quotation-${Date.now()}.pdf`;
      const filepath = path.join(pdfDir, filename);

      // Create a document
      const doc = new PDFDocument({ margin: 50 });

      // Pipe to a file
      const writeStream = fs.createWriteStream(filepath);
      doc.pipe(writeStream);

      // Add header with gradient effect (using colors)
      doc.rect(0, 0, doc.page.width, 150).fillColor('#CF0557').fill();
      
      // Company logo/name
      doc.fillColor('#FFFFFF')
         .fontSize(36)
         .font('Helvetica-Bold')
         .text('Molly Maid', 50, 40);
      
      doc.fillColor('#FFFFFF')
         .fontSize(14)
         .font('Helvetica')
         .text('Professional Cleaning Services', 50, 85);

      // Move down
      doc.moveDown(4);

      // Title
      doc.fillColor('#071D49')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('Service Quotation', 50, 180);

      // Date
      doc.fillColor('#666666')
         .fontSize(12)
         .font('Helvetica')
         .text(`Date: ${new Date().toLocaleDateString('en-US', { 
           year: 'numeric', 
           month: 'long', 
           day: 'numeric' 
         })}`, 50, 220);

      // Customer Details Section
      doc.moveDown(2);
      doc.fillColor('#071D49')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Customer Details', 50, doc.y);

      doc.moveDown(0.5);
      
      // Customer info box
      const customerBoxY = doc.y;
      doc.rect(50, customerBoxY, 500, 80)
         .strokeColor('#FB4D94')
         .lineWidth(2)
         .stroke();

      doc.fillColor('#333333')
         .fontSize(12)
         .font('Helvetica')
         .text(`Email: ${email}`, 60, customerBoxY + 15);
      
      doc.text(`Address: ${address}`, 60, customerBoxY + 35);
      doc.text(`Zip Code: ${zipCode}`, 60, customerBoxY + 55);

      // Service Details Section
      doc.moveDown(3);
      doc.fillColor('#071D49')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Service Details', 50, doc.y);

      doc.moveDown(0.5);

      // Service table header
      const tableTop = doc.y;
      doc.rect(50, tableTop, 500, 30)
         .fillColor('#FB4D94')
         .fill();

      doc.fillColor('#FFFFFF')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Service', 60, tableTop + 10, { width: 250 })
         .text('Details', 310, tableTop + 10, { width: 120 })
         .text('Price', 450, tableTop + 10, { width: 80, align: 'right' });

      // Service items
      let itemY = tableTop + 40;
      
      const services = [
        { name: 'Standard Cleaning Package', details: 'Living room, Kitchen', price: '$80' },
        { name: 'Bathroom Cleaning', details: '2 Bathrooms', price: '$50' },
        { name: 'Deep Clean Special', details: 'First-time discount', price: '$20' }
      ];

      services.forEach((service, i) => {
        if (i % 2 === 0) {
          doc.rect(50, itemY - 5, 500, 30).fillColor('#F9F9F9').fill();
        }
        
        doc.fillColor('#333333')
           .fontSize(11)
           .font('Helvetica')
           .text(service.name, 60, itemY, { width: 250 })
           .text(service.details, 310, itemY, { width: 120 })
           .font('Helvetica-Bold')
           .text(service.price, 450, itemY, { width: 80, align: 'right' });
        
        itemY += 30;
      });

      // Total
      doc.moveDown(1);
      doc.rect(50, itemY + 10, 500, 40)
         .fillColor('#071D49')
         .fill();

      doc.fillColor('#FFFFFF')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Total Amount:', 60, itemY + 22)
         .fontSize(18)
         .text('$150.00', 450, itemY + 20, { width: 80, align: 'right' });

      // Additional Information
      doc.moveDown(3);
      doc.fillColor('#071D49')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('Additional Information', 50, doc.y);

      doc.moveDown(0.5);
      doc.fillColor('#333333')
         .fontSize(11)
         .font('Helvetica')
         .text('• Estimated Duration: 3 hours', 60, doc.y);
      
      doc.moveDown(0.3);
      doc.text('• Service Area: Living room, Kitchen, 2 Bathrooms', 60, doc.y);
      
      doc.moveDown(0.3);
      doc.text('• Cleaning supplies and equipment included', 60, doc.y);
      
      doc.moveDown(0.3);
      doc.text('• 100% satisfaction guaranteed', 60, doc.y);

      // Terms & Conditions
      doc.moveDown(2);
      doc.fillColor('#071D49')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('Terms & Conditions', 50, doc.y);

      doc.moveDown(0.5);
      doc.fillColor('#666666')
         .fontSize(10)
         .font('Helvetica')
         .text('This quotation is valid for 30 days from the date of issue. Payment is due upon completion of service. Cancellations must be made 24 hours in advance.', 50, doc.y, { 
           width: 500, 
           align: 'justify' 
         });

      // View Quotation Link Section
      doc.moveDown(2);
      const linkBoxY = doc.y;
      doc.rect(50, linkBoxY, 500, 60)
         .fillColor('#F0F9FF')
         .fill()
         .strokeColor('#CF0557')
         .lineWidth(2)
         .stroke();

      doc.fillColor('#071D49')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('View Your Quotation Online', 60, linkBoxY + 10);

      doc.moveDown(0.3);
      const quotationUrl = `http://localhost:8080/quotation?email=${encodeURIComponent(email)}`;
      doc.fillColor('#CF0557')
         .fontSize(10)
         .font('Helvetica')
         .text(quotationUrl, 60, doc.y, {
           link: quotationUrl,
           underline: true,
           width: 480
         });

      doc.fillColor('#666666')
         .fontSize(9)
         .font('Helvetica-Oblique')
         .text('Click the link above to view and manage your quotation online', 60, doc.y + 5);

      // Footer
      doc.moveDown(2);
      const footerY = doc.page.height - 100;
      doc.rect(0, footerY, doc.page.width, 100)
         .fillColor('#071D49')
         .fill();

      doc.fillColor('#FFFFFF')
         .fontSize(10)
         .font('Helvetica')
         .text('Thank you for choosing Molly Maid!', 50, footerY + 20, { align: 'center', width: doc.page.width - 100 });
      
      doc.fillColor('#FB4D94')
         .fontSize(9)
         .text('Questions? Contact us at support@mollymaid.com | (555) 123-4567', 50, footerY + 40, { align: 'center', width: doc.page.width - 100 });

      doc.fillColor('#FFFFFF')
         .fontSize(8)
         .text('© 2025 Molly Maid. All rights reserved.', 50, footerY + 60, { align: 'center', width: doc.page.width - 100 });

      // Finalize PDF
      doc.end();

      writeStream.on('finish', () => {
        resolve(filepath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Cleanup old PDFs (optional - call this periodically)
export const cleanupOldPDFs = () => {
  const pdfDir = path.join(process.cwd(), 'temp-pdfs');
  if (fs.existsSync(pdfDir)) {
    const files = fs.readdirSync(pdfDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    files.forEach(file => {
      const filepath = path.join(pdfDir, file);
      const stats = fs.statSync(filepath);
      if (now - stats.mtimeMs > oneHour) {
        fs.unlinkSync(filepath);
        console.log(`🗑️  Deleted old PDF: ${file}`);
      }
    });
  }
};
