const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ConvocatorySchema = new Schema(
  {
    name: {type: String, required: true, maxlength:45 },
    initialDate: {type: String, required: true},
    finalDate: {type:String, required: true},
    // program: {type:String, required:true, maxlength: 45},
    maxQuotas: {type:Number, required:true},
    initialBootcampDate: {type:String, required: true},
    finalBootcampDate: {type:String, required: true},

    parameterization:{
      personalProfile: { type: Number, default:50 },
      sololearn: { type: Number, default:25},
      motivationLetter: { type: Number, default:25 },
    },

    residenceCountry: {type: Array, default: "Colombia"},
    residencyDepartment: Array,
    maxAge: Array,
    maxSocioeconomicStratus: Array,
    gender: Array,
    typePopulation: Array,
    
    test: Object,
    usersRegisted: Array,
    test: Object,
    status: Boolean
  }
);

const Convocatory = model('Convocatory', ConvocatorySchema)

module.exports = Convocatory