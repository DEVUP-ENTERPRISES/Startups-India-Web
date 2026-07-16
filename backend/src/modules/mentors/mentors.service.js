const { sendEmail } = require('../../utils/emailService');

async function sendWelcomeEmail({ email, fullName, expertise }) {
  const expertiseList = Array.isArray(expertise) && expertise.length > 0
    ? expertise.join(', ')
    : 'General Mentoring';

  await sendEmail({
    to: email,
    subject: 'Welcome to the Startup India Mentor Network!',
    html: `
      <h2>Welcome, ${fullName}!</h2>
      <p>You are now part of the Startup India Incubation mentor network.</p>
      <p><strong>Your expertise areas:</strong> ${expertiseList}</p>
      <p>Log in to your mentor dashboard to set your availability and start connecting with startups.</p>
      <p>Best regards,<br>The Startup India Incubation Team</p>
    `,
  });

  return true;
}

module.exports = { sendWelcomeEmail };
