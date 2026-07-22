const { sendEmail } = require('../../utils/emailService');
const { wrap, pill, hr } = require('../../utils/emailTemplates');

async function sendWelcomeEmail({ email, fullName, expertise }) {
  const expertiseList = Array.isArray(expertise) && expertise.length > 0
    ? expertise.join(', ')
    : 'General Mentoring';

  const inner = `
    <tr>
      <td style="padding:36px 32px 28px;">
        ${pill('Welcome')}
        <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:32px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
          Welcome, ${fullName}!
        </h1>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          You are now part of the Startup India Incubation mentor network.
        </p>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          <strong>Your expertise areas:</strong> ${expertiseList}
        </p>
        <p style="margin:0 0 20px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          Log in to your mentor dashboard to set your availability and start connecting with startups.
        </p>
      </td>
    </tr>
    ${hr()}
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to the Startup India Mentor Network!',
    html: wrap('Welcome to the network', 'Welcome', inner),
  });

  return true;
}

module.exports = { sendWelcomeEmail };
