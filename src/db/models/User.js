const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		names: {
			type: String,
			required: [true, "Por favor ingresa tus nombres"],
			trim: true,
		},
		surname: {
			type: String,
			required: [true, "Por favor ingresa tus apellidos"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Por favor ingresa un correo electrónico"],
			trim: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: [true, "Por favor ingresa una contraseña, esta debe tener mínimo 6 caracteres"],
		},
		role: {
			type: Number,
			default: 0, // 0 = user, 1 = admin, 3 = observer, 4 = interviewer
		},
		avatar: {
			type: String,
			default:
				"https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
	{ 
		versionKey: false 
	}
);

// userSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id
//       delete returnedObject._id
//       delete returnedObject.__v
//       delete returnedObject.passwordHash
//     }
//   })

module.exports = mongoose.model("User", userSchema);
