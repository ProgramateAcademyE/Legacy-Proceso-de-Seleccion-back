const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CitationSchema = new Schema({
  /* 	users: Array,
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	title: { type: String, required: true },
	link: { type: String, required: true },
	notes: { type: String, required: true },
	quotas: { type: Number, required: true },
	testTechnical: { type: String, required: true },
	journey: { type: Number, required: true },
}); */

  appointmentDate: {
    type: Date,
  },
  shift: {
    type: ["mañana", "tarde"],
    default: "mañana",
  },
  applicantQuota: {
    type: Number,
  },
  enrolledNumber: {
    type: Number,
    count: 0,
  },
  titleConvocatory: {
    type: String,
  },
  shiftStart: {
    type: String,
    required: true,
  },
  shiftEnd: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  // new field
  users: [
    {
      userID: String,
      names: String,
      surame: String,
      documentNumber: Number,
      location: String,
    },
  ],
});

const Citation = model("Citation", CitationSchema);

module.exports = Citation;
	