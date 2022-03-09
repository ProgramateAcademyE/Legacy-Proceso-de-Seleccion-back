const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ConvocatorySchema = new Schema(
  {
    name: {type: String, required: true, maxlength:45 },
    initialDate: {type:Date, required: true},
    finalDate: {type:Date, required: true},
    program: {type:String, required:true, maxlength: 45},
    maxQuotas: {type:Number, required:true},
    initialBootcampDate: {type:Date, required: true},
    finalBootcampDate: {type:Date, required: true},
    parameterization:{
      personalProfile: { type: Number, default:50 },
      sololearn: { type: Number, default:25},
      motivationLetter: { type: Number, default:25 },
    },
    residenceCountry: {type: String, default: "Colombia"},
    residencyDepartment: String,
    maxAge: Number,
    maxSocioeconomicStratus:{type:Number, default:3},
    test: Object,
    usersRegisted: Array,
    test: Object,
    status: Boolean
  }
);

const Convocatory = model('Convocatory', ConvocatorySchema)

module.exports = Convocatory