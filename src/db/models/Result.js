const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ResultSchema = new Schema(
  {
    user_id: {type: String },
    userFullName: {type: String, required: true, maxlength: 45},
    htmlScore: {type: Number, required: true},
    cssScore: {type: Number, required: true},
    javascriptScore: {type: Number, required: true},
    pythonScore: {type: Number},
    Score: {type: Number},
    soloLearnScore: {type: Number},
    personalProfileScore: {type: Number},
    motivationScore: {type: Number},
    finalScore: {type: Number}
  }
);

const Result = model('Result', ResultSchema)

module.exports = Result 