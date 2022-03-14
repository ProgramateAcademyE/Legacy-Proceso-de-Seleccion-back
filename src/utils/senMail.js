const nodemailer = require('nodemailer')

const trasporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth:{
    user: 'jairovsolarte17@gmail.com',
    pass: 'qjrexbxvkodlphag'
  },
})

trasporter.verify().then( ()=> {
  console.log('ready for send emails')
})

module.exports = trasporter