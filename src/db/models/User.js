const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    names: {
        type: String,
        required: [true, "Please enter your names!"],
        trim: true
    },
    surname: {
        type: String,
        required: [true, "Please enter your surname!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin, 3 = observer, 4 = interviewer
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// userSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id
//       delete returnedObject._id
//       delete returnedObject.__v
//       delete returnedObject.passwordHash
//     }
//   })
  
module.exports = mongoose.model("User", userSchema)