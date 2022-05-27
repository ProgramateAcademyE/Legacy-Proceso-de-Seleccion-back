const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AvailabilitySchema = new Schema({
  citationID: String,
  date: String,
  shift: String, // mañana o tarde
  selectors: [
    {
      _id: String, //selectorID
      names: String,
      surname: String,
      role: Number, // 3||4 || 1,
      meetRole: Number, // 3 interviewer || 4 observer
    },
  ],
});

const Availability = model("Availability", AvailabilitySchema);

module.exports = Availability;
