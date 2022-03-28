const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TechTest = new Schema(
  {
    title: String,
    url: String,
    pdf: String,
    convocatories: Array
  }
);

const Test = model('Test', TechTest)

module.exports = Test