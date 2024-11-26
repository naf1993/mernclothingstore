import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ userEmail, subject, textContent, htmlContent }) => {
  const msg = {
    to: userEmail,
    from: process.env.SENDGRID_USER_EMAIL,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };
  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${userEmail} succesfully`);
  } catch (error) {
    console.error("Error sending email:", error.response.body);
  }
};
