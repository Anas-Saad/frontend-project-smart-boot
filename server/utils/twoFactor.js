import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateTwoFactorSecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `QLINE AI (${email})`,
    issuer: 'QLINE AI Platform',
    length: 32
  });

  return {
    base32: secret.base32,
    otpauth_url: secret.otpauth_url,
    qr_code_ascii: secret.ascii
  };
};

export const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps (60 seconds) of variance
  });
};