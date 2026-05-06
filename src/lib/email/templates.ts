const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const buttonStyle = `
  display: inline-block;
  background: #18181b;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
`;

export function welcomeEmail(name: string, username: string) {
  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${username}`;
  return {
    subject: "Welcome to Folio!",
    html: `
      <div style="${baseStyles}">
        <h1 style="font-size: 24px; font-weight: 700;">Welcome to Folio, ${name}!</h1>
        <p style="color: #71717a; line-height: 1.6;">
          Your portfolio is live and ready to be shared. Start adding your projects, experience, and skills to make it yours.
        </p>
        <p style="margin: 24px 0;">
          <a href="${portfolioUrl}" style="${buttonStyle}">View Your Portfolio</a>
        </p>
        <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
          Your portfolio URL: <a href="${portfolioUrl}" style="color: #18181b;">${portfolioUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
        <p style="color: #a1a1aa; font-size: 12px;">
          Folio — Your career, one link.
        </p>
      </div>
    `,
  };
}

export function testimonialRequestEmail(
  requesterName: string,
  recipientName: string,
  formUrl: string
) {
  return {
    subject: `${requesterName} is requesting a testimonial`,
    html: `
      <div style="${baseStyles}">
        <h1 style="font-size: 24px; font-weight: 700;">Testimonial Request</h1>
        <p style="color: #71717a; line-height: 1.6;">
          Hi ${recipientName},
        </p>
        <p style="color: #71717a; line-height: 1.6;">
          ${requesterName} would love a testimonial from you for their portfolio. It only takes a minute.
        </p>
        <p style="margin: 24px 0;">
          <a href="${formUrl}" style="${buttonStyle}">Write Testimonial</a>
        </p>
        <p style="color: #a1a1aa; font-size: 14px;">
          This link will take you to a short form where you can leave your recommendation.
        </p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
        <p style="color: #a1a1aa; font-size: 12px;">
          Sent via Folio — folio.site
        </p>
      </div>
    `,
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Reset your password",
    html: `
      <div style="${baseStyles}">
        <h1 style="font-size: 24px; font-weight: 700;">Reset Your Password</h1>
        <p style="color: #71717a; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="${buttonStyle}">Reset Password</a>
        </p>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email. The link expires in 1 hour.
        </p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
        <p style="color: #a1a1aa; font-size: 12px;">
          Folio — Your career, one link.
        </p>
      </div>
    `,
  };
}
