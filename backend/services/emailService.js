import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * MAUSAM SETU — Automated Email Notification Service
 * Uses Nodemailer with Gmail SMTP or custom SMTP.
 * Falls back seamlessly to simulated test mode if credentials are not yet configured.
 */

let isConfigured = false;

// Initialize mail transporter
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass && user !== 'your-email@gmail.com') {
    isConfigured = true;
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, ''), // Supports 16-character Google App Password format
      },
    });
  }

  // If no credentials configured yet, we operate in development / simulation mode
  isConfigured = false;
  return null;
}

/**
 * Sends automated welcome email upon account registration
 */
export async function sendWelcomeEmail({ email, name, mobile, role = 'citizen', state = 'India', origin = 'http://localhost:5000' }) {
  if (!email) {
    return { success: false, error: 'No recipient email provided' };
  }

  const siteOrigin = origin || 'http://localhost:5000';
  const roleTitle = role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'Citizen';
  const nowStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const subject = `🎉 Welcome to Mausam Setu — Account Registered Successfully`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mausam Setu</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F4F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F0F4F8;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width:580px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);border:1px solid #E2E8F0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Brand Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F2758 0%,#1E40AF 60%,#2563EB 100%);padding:36px 30px;text-align:center;">
              <div style="font-size:42px;margin-bottom:10px;">🌤️</div>
              <h1 style="color:#FFFFFF;font-size:24px;font-weight:800;margin:0 0 6px;letter-spacing:-0.02em;">MAUSAM SETU</h1>
              <p style="color:#BFDBFE;font-size:13.5px;margin:0;font-weight:500;">National Weather Observation & Disaster Early Warning System</p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding:32px 30px 20px;">
              <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin:0 0 14px;">
                Namaste, ${name || 'Citizen'}! 🙏
              </h2>
              <p style="font-size:14.5px;line-height:1.6;color:#334155;margin:0 0 20px;">
                Welcome to <strong>Mausam Setu</strong>. Your new account has been successfully created and registered on our meteorological observation platform.
              </p>

              <!-- Account Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:14px;margin-bottom:24px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #E2E8F0;background-color:#EFF6FF;">
                    <strong style="color:#1D4ED8;font-size:12.5px;text-transform:uppercase;letter-spacing:0.06em;">📋 Registered Account Details</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size:13.5px;">
                      <tr>
                        <td width="38%" style="color:#64748B;font-weight:600;">📧 Email ID:</td>
                        <td style="color:#0F172A;font-weight:700;">${email}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748B;font-weight:600;">📲 Phone:</td>
                        <td style="color:#0F172A;font-weight:700;">+91 ${mobile || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748B;font-weight:600;">👤 User Role:</td>
                        <td style="color:#0F172A;font-weight:700;"><span style="background:#DBEAFE;color:#1E40AF;padding:2px 8px;border-radius:10px;font-size:12px;">${roleTitle}</span></td>
                      </tr>
                      <tr>
                        <td style="color:#64748B;font-weight:600;">📍 Primary State:</td>
                        <td style="color:#0F172A;font-weight:700;">${state}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748B;font-weight:600;">🕒 Registered On:</td>
                        <td style="color:#64748B;">${nowStr}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748B;font-weight:600;">🌐 Website Origin:</td>
                        <td style="color:#2563EB;font-weight:600;">${siteOrigin}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <div style="background-color:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 16px;border-radius:8px;margin-bottom:24px;">
                <div style="font-size:13px;color:#92400E;line-height:1.5;">
                  <strong>🔔 Account Security Alert:</strong> A live security notification was also transmitted to your registered device for email <strong>${email}</strong> from website <strong>Mausam Setu</strong>.
                </div>
              </div>

              <!-- Available Features -->
              <p style="font-size:14px;font-weight:700;color:#0F172A;margin:0 0 10px;">⚡ Key Portal Features Ready For You:</p>
              <ul style="font-size:13.5px;color:#475569;line-height:1.7;margin:0 0 28px;padding-left:20px;">
                <li><strong>📊 Live IMD Observations</strong> — Real-time telemetry, humidity, and 7-day Apple-style weather outlook.</li>
                <li><strong>🤖 WeatherGPT</strong> — Bilingual AI meteorological assistant for smart crop, fishing, and travel advisories.</li>
                <li><strong>🗺️ Interactive Hazard Map</strong> — Early cyclone, heavy rain, and flood warning zones across India.</li>
                <li><strong>🚨 Verified Emergency Hub</strong> — Direct one-tap contact to NDMA (1078), Police (112), and ambulance (108).</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="text-align:center;margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="${siteOrigin}/dashboard.html" target="_blank" style="background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#FFFFFF;text-decoration:none;font-size:14.5px;font-weight:800;padding:14px 34px;border-radius:30px;display:inline-block;box-shadow:0 6px 18px rgba(37,99,235,0.35);letter-spacing:0.02em;">
                      🚀 Open My Weather Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Official Footer -->
          <tr>
            <td style="background-color:#F8FAFC;border-top:1px solid #E2E8F0;padding:24px 30px;text-align:center;font-size:12px;color:#94A3B8;line-height:1.6;">
              <p style="margin:0 0 8px;font-weight:600;color:#64748B;">
                🚨 Official 24/7 Helplines: National Emergency <strong>112</strong> &nbsp;|&nbsp; NDMA <strong>1078</strong> &nbsp;|&nbsp; Kisan <strong>1551</strong>
              </p>
              <p style="margin:0 0 4px;">
                Mausam Setu • Powered by IMD Observations, MoES & NDMA Disaster Mesh
              </p>
              <p style="margin:0;font-size:11px;color:#CBD5E1;">
                If you did not register for this account, please disregard this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const activeTransporter = getTransporter();

    if (activeTransporter) {
      // Send real email via configured SMTP
      const sender = process.env.EMAIL_FROM || `"Mausam Setu" <${process.env.EMAIL_USER}>`;
      const info = await activeTransporter.sendMail({
        from: sender,
        to: email,
        subject: subject,
        html: htmlContent,
      });

      console.log(`[EMAIL DISPATCHED] Real welcome email delivered to ${email} (Message ID: ${info.messageId})`);
      return {
        success: true,
        delivered: true,
        messageId: info.messageId,
        recipient: email,
        subject: subject,
        mode: 'real_smtp',
      };
    } else {
      // Simulated delivery for local development without credentials
      console.log(`\n========================================================`);
      console.log(`[WELCOME EMAIL SENT (DEV/TEST MODE)]`);
      console.log(`To: ${name} <${email}>`);
      console.log(`Subject: ${subject}`);
      console.log(`Mobile: +91 ${mobile}`);
      console.log(`Role: ${roleTitle} | State: ${state}`);
      console.log(`Note: To send REAL emails to actual inboxes, configure EMAIL_USER & EMAIL_PASS in backend/.env`);
      console.log(`========================================================\n`);

      return {
        success: true,
        delivered: true,
        recipient: email,
        subject: subject,
        mode: 'simulated_dev',
        note: 'Email processed successfully in dev mode. Set EMAIL_USER & EMAIL_PASS in .env for live inbox dispatch.'
      };
    }
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send welcome email:', err.message);
    return {
      success: false,
      error: err.message,
      recipient: email
    };
  }
}

/**
 * Sends OTP email for password reset verification
 */
export async function sendOtpEmail({ email, name = 'Valued Citizen', otp, origin = 'http://localhost:5000' }) {
  if (!email) {
    return { success: false, error: 'No recipient email provided' };
  }

  const subject = `🔐 Mausam Setu — Password Reset OTP: ${otp}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#F0F4F8;color:#1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F0F4F8;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);border:1px solid #E2E8F0;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#020B18 0%,#0F172A 60%,#1E3A8A 100%);padding:32px 30px;text-align:center;">
              <div style="font-size:38px;margin-bottom:8px;">🌤️</div>
              <h1 style="color:#FFFFFF;margin:0;font-size:24px;font-weight:800;letter-spacing:0.5px;">Mausam Setu</h1>
              <p style="color:#38BDF8;margin:6px 0 0 0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">National Disaster Early-Warning Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 12px 0;">Password Reset Request</h2>
              <p style="font-size:14.5px;line-height:1.6;color:#475569;margin:0 0 24px 0;">
                Namaste <strong>${name}</strong>,<br>
                We received a request to recover the password for your <strong>Mausam Setu</strong> account. Use the 6-digit One-Time Password (OTP) below to complete your password reset:
              </p>

              <!-- OTP Code Display -->
              <div style="text-align:center;margin:28px 0;">
                <div style="display:inline-block;background:#EFF6FF;border:2px dashed #3B82F6;border-radius:14px;padding:18px 36px;font-size:36px;font-weight:800;letter-spacing:8px;color:#1D4ED8;font-family:monospace;">
                  ${otp}
                </div>
                <div style="font-size:12px;color:#64748B;margin-top:10px;font-weight:600;">
                  ⏱️ This OTP is valid for <strong>10 minutes</strong>.
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background:#FFFBEB;border-left:4px solid #F59E0B;padding:14px 18px;border-radius:8px;margin:24px 0 16px 0;">
                <p style="font-size:12.5px;color:#92400E;margin:0;line-height:1.5;">
                  <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Mausam Setu officials will never call or message asking for your verification code. If you did not request this reset, your account is safe and you can ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F8FAFC;padding:22px 30px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="font-size:12px;color:#64748B;margin:0 0 8px 0;">
                Disaster Helpline: <strong>1078</strong> (NDMA) &nbsp;|&nbsp; National Emergency: <strong>112</strong>
              </p>
              <p style="font-size:11px;color:#94A3B8;margin:0;">
                Mausam Setu · Ministry of Earth Sciences & India Meteorological Department
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const transporter = getTransporter();

    if (isConfigured && transporter) {
      const fromAddr = process.env.EMAIL_FROM || `Mausam Setu Security <${process.env.EMAIL_USER}>`;
      const info = await transporter.sendMail({
        from: fromAddr,
        to: email,
        subject: subject,
        html: htmlContent,
      });

      console.log(`[EMAIL OTP DISPATCHED] OTP email delivered to ${email} (Message ID: ${info.messageId})`);
      return {
        success: true,
        delivered: true,
        messageId: info.messageId,
        recipient: email,
        mode: 'real_smtp',
      };
    } else {
      console.log(`\n========================================================`);
      console.log(`[PASSWORD RESET OTP DISPATCHED (DEV/TEST MODE)]`);
      console.log(`To: ${name} <${email}>`);
      console.log(`Subject: ${subject}`);
      console.log(`6-Digit OTP Code: ${otp}`);
      console.log(`Valid: 10 minutes`);
      console.log(`========================================================\n`);

      return {
        success: true,
        delivered: true,
        recipient: email,
        otp: otp,
        mode: 'simulated_dev',
        note: 'OTP generated and delivered in dev mode. Set EMAIL_USER & EMAIL_PASS in .env for live inbox dispatch.'
      };
    }
  } catch (err) {
    console.error('[EMAIL OTP ERROR] Failed to send OTP email:', err.message);
    return {
      success: false,
      error: err.message,
      recipient: email
    };
  }
}

export default {
  sendWelcomeEmail,
  sendOtpEmail,
};
