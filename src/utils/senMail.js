const nodemailer = require('nodemailer')
const { SECRET_PASSWORD, EMAIL } = process.env;

// objeto JSON con los parámetros que solicita esta paquetería.
const trasporter = nodemailer.createTransport({ // crear un objeto transportador a través del siguiente método "createTransport".
  host: 'smtp.gmail.com', // hace referencia al nombre o IP de tu servidor SMTP
  port: 465, // puerto asignado por el servidor SMTP para el envió de correos
  secure: true, // si usas https su valor debe ser true, de lo contrario false
  auth:{ //  es un JSON con los datos de autentificación  al servidor SMTP
    user: EMAIL, // usuario registrado
    pass: SECRET_PASSWORD // contraseña del usuario registrado
  },
})
// funcion de verificacion para enviar correos
trasporter.verify().then( ()=> {
  console.log('ready for send emails')
})

module.exports = trasporter