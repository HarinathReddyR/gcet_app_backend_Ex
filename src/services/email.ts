
import nodemailer from 'nodemailer';

var sendTo:string[] = ['21r11a05l4@gcet.edu.in']
// Create a transporter object
export const transporter = nodemailer.createTransport({
  //host: 'live.smtp.mailtrap.io',
  host:'smtp.gmail.com',
  port: 587,
  service: 'gmail',
  secure: false, // use SSL
  auth: {
    user: 'ramidiharinathreddy@gmail.com',
    pass: 'pvdlsfoykhbdxzmu',
  }
});

// Configure the mailoptions object
export const mailOptions = {
  from: 'ramidiharinathreddy@gmail.com',
  to: sendTo,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};