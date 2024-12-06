import sgMail from "@sendgrid/mail";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const getTemplate = (templateName, replacements) => {
  try {
    const templatePath = path.join(__dirname, '../views', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');
    for (let [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, value);
    }
    return template;
  } catch (error) {
    console.error('Error reading template:', error);
    throw new Error('Template not found');
  }
};
export const sendEmail = async ({ userEmail, subject, templateName, replacements }) => {
  try {
    // Get the HTML content by loading the appropriate template
    const htmlContent = getTemplate(templateName, replacements);

    const msg = {
      to: userEmail,
      from: process.env.FROM_ADDRESS,  // Your verified SendGrid sender email
      subject: subject,     
      text: replacements.textContent,  // Fallback text content if not provided
      html: htmlContent,
    }; 

    // Send the email via SendGrid
    await sgMail.send(msg);
    console.log(`Email sent to ${userEmail} successfully`);
  } catch (error) {
    console.error('Error sending email:', error.response.body);
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Response body:', error.response.body);
      console.error('Response status code:', error.response.statusCode);
      console.error('Response headers:', error.response.headers);
    }
  }
};
