import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amitkumarashutos@gmail.com",
    pass: process.env.NODEMAILER_SECRET_KEY!,
  },
});

// Generate a 6-digit OTP
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateOtpEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
        <p style="font-size: 16px; color: #666;">Use the OTP below to complete your authentication process.</p>
        <div style="font-size: 24px; font-weight: bold; color: #1d4ed8; background: #eef2ff; padding: 10px; border-radius: 5px; display: inline-block;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888; margin-top: 10px;">This OTP will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">If you didn’t request this, you can ignore this email.</p>
      </div>
    </div>
  `;
};

export const generatePasskeyEmail = (username: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #666;">Hello <strong>${username}</strong>,</p>
        <p style="font-size: 16px; color: #666;">Your passkey has been successfully registered and is now linked to your account.</p>
        <p style="font-size: 16px; color: #666;">To enhance your security, make sure to enable two-factor authentication in your account settings. If you have already enabled it, no further action is needed.</p>
        <div style="background: #eef2ff; padding: 10px; border-radius: 5px; color: #1d4ed8; font-weight: bold; display: inline-block;">
          Your passkey allows for a faster and more secure login experience on trusted devices.
        </div>
        <p style="font-size: 14px; color: #888; margin-top: 10px;">You can manage your authentication settings anytime in your account preferences.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">If you need any assistance, feel free to reach out to our support team.</p>
      </div>
    </div>
  `;
};
