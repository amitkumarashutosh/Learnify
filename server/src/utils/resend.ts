import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

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
