const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
// const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground/#step3&url=https%3A%2F%2F&content_type=application%2Fjson&http_method=GET&useDefaultOauthCred=unchecked&oauthEndpointSelect=Google&oauthAuthEndpointValue=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fv2%2Fauth&oauthTokenEndpointValue=https%3A%2F%2Foauth2.googleapis.com%2Ftoken&includeCredentials=unchecked&accessTokenType=bearer&autoRefreshToken=checked&accessType=offline&prompt=consent&response_type=code&wrapLines=on'

const {
	MAILING_SERVICE_CLIENT_ID,
	MAILING_SERVICE_CLIENT_SECRET,
	MAILING_SERVICE_REFRESH_TOKEN,
	SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
	MAILING_SERVICE_CLIENT_ID,
	MAILING_SERVICE_CLIENT_SECRET,
	MAILING_SERVICE_REFRESH_TOKEN,
	OAUTH_PLAYGROUND,
);

// send email
const sendEmail = (to, url, txt) => {
	oauth2Client.setCredentials({
		refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
	});

	const accessToken = oauth2Client.getAccessToken();
	const smtpTransport = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: SENDER_EMAIL_ADDRESS,
			clientId: MAILING_SERVICE_CLIENT_ID,
			clientSecret: MAILING_SERVICE_CLIENT_SECRET,
			refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
			accessToken,
		},
	});
// JSON de datos que se debe crear para establecer la comunicación con el servidor de correos,
// en donde se incluyen los datos de los destinatarios, asunto, mensaje, etc
	const mailOptions = {
		from: SENDER_EMAIL_ADDRESS, //  es el correo origen o el correo que esta enviando el email
		to: to, // el destinatario quien debe recibir el correo
		subject: "Welcome App", // asunto del correo
		//  Nodemailer nos permite enviar un mensaje codificado en lenguaje HTML
		html: ` 
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DevAT channel.</h2>
            <p>Congratulations! You're almost set to start using DEVAT✮SHOP.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `,
	};
// el objeto smtpTransport cuenta con un método de nombre sendMail el cual recibe como parámetros los datos del correo que se quiere enviar y regresa un callback
	smtpTransport.sendMail(mailOptions, (err, infor) => {
		if (err) return err;
		console.log("SEND MAIL ERROR!!!!!!", infor);
	});
};

module.exports = sendEmail;
