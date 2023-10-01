import nodemailer from 'nodemailer'

//new Email(user,url).sendWelcome()

class Email{
  constructor(user,url){
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Nafitha Mohammed <${process.env.EMAIL_FROM}>`

  }
  createTransport(){
    if(process.env.NODE_ENV === 'production'){
      //sendgrid
      return 1
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
      }
    });
  }
}


const sendEmail = async options => {
    // 1) Create a transporter
    
  
    // 2) Define the email options
    const mailOptions = {
      from: 'Nafitha Mohammed <nafithajas@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message
      // html:
    };
  
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
  };
  
  export default sendEmail;
  