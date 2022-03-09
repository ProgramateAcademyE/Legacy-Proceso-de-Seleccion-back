const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AdministratorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    rol: {
      interviewer: Boolean,
      observer: Boolean,
      monitor: Boolean
    },
    available: { type: Boolean, required: true },
  },
);

const Administrator = model('interviewer', AdministratorSchema);
module.exports = Administrator;