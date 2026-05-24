const nodemailer = require('nodemailer');

// In-memory store for messages (replace with DB model if you want persistence)
// Using Contact model if available, otherwise just email forwarding
let contactMessages = [];

exports.submitContact = async (req, res) => {
  try {
    const { name, email, topic, subject, message } = req.body;

    if (!name || !email || !topic || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Save to in-memory store (swap for DB model if needed)
    const entry = { name, email, topic, subject, message, createdAt: new Date() };
    contactMessages.push(entry);

    // Send email notification if SMTP env vars are set
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      // Notify editorial team
      await transporter.sendMail({
        from: `"AfriLENS Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECEIVE_EMAIL || 'editorial@afrilens.com',
        subject: `[${topic}] ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Topic</td><td style="padding:8px">${topic}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px">${message.replace(/\n/g, '<br/>')}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Received</td><td style="padding:8px">${new Date().toLocaleString()}</td></tr>
          </table>
        `,
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from: `"AfriLENS" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `We received your message — ${subject}`,
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for contacting AfriLENS. We've received your message regarding <strong>${topic}</strong> and will get back to you within 24–48 hours.</p>
          <p>Your reference: <strong>${subject}</strong></p>
          <br/>
          <p>Best regards,<br/>The AfriLENS Team<br/>editorial@afrilens.com</p>
        `,
      });
    }

    res.status(200).json({ success: true, message: 'Message received. We will be in touch soon.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};

// Admin: get all messages
exports.getMessages = async (req, res) => {
  try {
    res.json({ success: true, messages: contactMessages.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
