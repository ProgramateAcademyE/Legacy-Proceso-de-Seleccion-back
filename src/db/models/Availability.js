const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AvailabilitySchema = new Schema({
  date: Date,
  shift: String, // mañana o tarde
  selectors: [
    {
      selectorID: String,
      firstName: String,
      lastName: String,
      role: Number, // 3||4 || 1,
      meetRole: Number, // 3 interviewer || 4 observer
    },
  ],
});

const Availability = model("Availability", AvailabilitySchema);

module.exports = Availability;