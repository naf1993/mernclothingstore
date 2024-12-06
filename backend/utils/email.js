import sgMail from "@sendgrid/mail";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to load and populate the HTML template with dynamic content
const getTemplate = (templateName, replacements) => {
  try {
    // Define the path to the views folder where templates are stored
    const templatePath = path.join(__dirname, '../views', `${templateName}.html`);

    // Read the HTML template file
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders with actual dynamic values (from 'replacements' object)
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

// General function to send email with dynamic content
export const sendEmail = async ({ userEmail, subject, templateName, replacements }) => {
  try {
    // Get the HTML content by loading the appropriate template
    const htmlContent = getTemplate(templateName, replacements);

    const msg = {
      to: userEmail,
      from: process.env.FROM_ADDRESS,  // Your verified SendGrid sender email
      subject: subject,
      text:'hello',
      // text: replacements.textContent || 'Your order details are provided below.',  // Fallback text content if not provided
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
