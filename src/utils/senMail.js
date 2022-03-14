const nodemailer = require('nodemailer')
const { SECRET_PASSWORD, EMAIL } = process.env;


const trasporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth:{
    user: EMAIL,
    pass: SECRET_PASSWORD
  },
})

trasporter.verify().then( ()=> {
  console.log('ready for send emails')
})

module.exports = trasporter