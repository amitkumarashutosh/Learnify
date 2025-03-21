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

export const getIpAndLocation = async () => {
  try {
    // Fetch IPv4 address
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    // Fetch geolocation based on IP
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoResponse.json();

    return {
      ip,
      country: geoData.country,
      region: geoData.regionName,
      city: geoData.city,
      isp: geoData.isp,
    };
  } catch (error) {
    console.error("Failed to fetch IP and location:", error);
    return null;
  }
};

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

export const generatePasskeyEmailTemplate = (
  username: string,
  country: string,
  region: string,
  city: string,
  isp: string,
  ip: string // ✅ Added IP address
): string => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9fafb;">
      <div style="max-width: 450px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color: #1d4ed8;">🔐 Passkey Registered Successfully</h2>
        <p style="font-size: 16px; color: #333;">Hello <strong>${username}</strong>,</p>
        <p style="font-size: 15px; color: #555;">
          Your passkey has been successfully registered and is now linked to your account.
        </p>
        
        <div style="background: #eef2ff; padding: 12px; border-radius: 8px; color: #1d4ed8; font-weight: bold; display: inline-block; margin: 10px 0;">
          Enjoy faster and more secure logins on trusted devices!
        </div>
        
        <p style="font-size: 15px; color: #555; margin-top: 15px;">
          <strong>Registration Details:</strong>
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: left;">
          <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${city}, ${region}, ${country}</p>
          <p style="margin: 5px 0;"><strong>🌐 ISP:</strong> ${isp}</p>
          <p style="margin: 5px 0;"><strong>🔢 Registered from IP:</strong> ${ip}</p> <!-- ✅ Added IP -->
        </div>

        <p style="font-size: 14px; color: #888; margin-top: 20px;">
          You can manage your authentication settings anytime in your account preferences.
        </p>

        <p style="font-size: 14px; color: #e11d48; margin-top: 15px;">
          <strong>⚠️ If this was not you</strong>, please reset your credentials and contact support immediately.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">
          This is an automated email. Please do not reply. If you have any concerns, visit our support page.
        </p>
      </div>
    </div>
  `;
};
