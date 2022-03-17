const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AdministratorSchema = new Schema(
  {
    names: { type: String, required: true },
    surname: { type: String, required: true },
    role: {
      interviewer: Boolean,
      observer: Boolean,
      monitor: Boolean
    },
    available: { type: Boolean, required: true },
  },
);

const Administrator = model('interviewer', AdministratorSchema);
module.exports = Administrator;
  