import dotenv from 'dotenv'
dotenv.config()
import Subscription from "../models/subscriptionModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const addSubscription = catchAsync(async(req,res,next)=>{
    const {email} = req.body
    const existingUser = await Subscription.findOne({email})
    if(existingUser){
        return next(new AppError('You are already subscribed',400))
    }
    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    console.log('email',email)
    const msg = {
        to: email,
        from: 'support@themodeststore.shop',
        subject:'Thank you for subscribing',
        text: 'You will now receive updates on discounts and offers.',
        html: '<strong>Thank you for subscribing!</strong>',

    }
    try {
        await sgMail.send(msg);
        res.status(201).json({ message: 'Thanks for Subscribing' });
    } catch (error) {
        console.error('SendGrid Error:', error.response.body);
        return next(new AppError('Failed to send email', 500));
    }
})
