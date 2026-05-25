export const otpEmailTemplate = (code: string, email: string, expiresAt: Date) => {
  const frontendUrl = `http://localhost:3000/otp?email=${encodeURIComponent(email)}`;

  return `
    <div style="font-family: sans-serif;">
      <h2>Verifikasi OTP</h2>

      <p>Klik tombol berikut untuk memasukkan OTP:</p>

      <a href="${frontendUrl}" style="
        display:inline-block;
        padding:10px 20px;
        background:#000;
        color:#fff;
        text-decoration:none;
        border-radius:6px;
      ">
        Masukkan OTP
      </a>

      <p>Atau gunakan kode berikut:</p>

      <div style="
        font-size: 24px;
        letter-spacing: 6px;
        font-weight: bold;
        margin: 20px 0;
      ">
        ${code}
      </div>

      <p>OTP berlaku sampai ${expiresAt.toLocaleString()}.</p>
    </div>
  `;
};