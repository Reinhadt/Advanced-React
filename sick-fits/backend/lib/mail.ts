import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANIceEmail(text: string) {
  return `
		<div style="border: 1px solid black; padding: 20px: font-family: sans-serif; line-height: 2; font-size:20px;">
			<h2>Hello</h2>
			<p>${text}</p>
			<p>Omar</p>
		</div>
    `;
}

interface MailResponse {
  message: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info: MailResponse = await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Password reset token',
    html: makeANIceEmail(`Your password reset token is here!
			<a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click to reset</a>`),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`Message sent, preview it at ${getTestMessageUrl(info)}`);
  }
}
