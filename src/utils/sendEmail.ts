import {createTransport} from 'nodemailer'


export const sendEmail = async(to:string, subject:string, text:string)=>{
    const transporter =createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASSWORD!
        }
    })

    await transporter.sendMail({
        to, subject, text, from:"sajeersayed@gmail.com"
    })
    
}