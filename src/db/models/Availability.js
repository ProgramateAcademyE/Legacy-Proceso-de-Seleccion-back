const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AvailabilitySchema = new Schema({
  date: Date,
  shift: [], // mañana o tarde o ambas
  selectors: [
    {
      selectorID: String,
      firstName: String,
      lastName: String,
      role: Number, // 3||4 || 1,
      availability: [
        {
          shift: String, // mañana o tarde
          meetRole: Number, // 3 interviewer || 4 observer
        },
      ],
    },
  ],
});

const Availability = model("Availability", AvailabilitySchema);

module.exports = Availability;