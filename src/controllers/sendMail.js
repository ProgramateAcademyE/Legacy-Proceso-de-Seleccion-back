const { EMAIL } = process.env;
const transporter = require('../utils/senMail')
// send email
const sendMail = async (to, url, subject) => {
    await transporter.sendMail({
        from: `${subject} <${EMAIL}>`,
		to: to,
		subject: subject,
		html: `
            <div style="max-width: 700px; margin:auto; border: 3px solid #ccc; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Prográmate by Educamás</h2>
            <p>Bienvenidos a Prográmate</p>
            
            <a href=${url} style="background: #ffcc00; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${subject}</a>
        
            <p>Si el boton no funciona por alguna razon entonces copie el siguiente link en una pestaña de su navegador</p>
        
            <div>${url}</div>
            </div>
        `,
    });
    console.log('Registro exitoso')
};

module.exports = sendMail;
