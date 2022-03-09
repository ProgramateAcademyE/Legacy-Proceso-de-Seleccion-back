const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CitationSchema = new Schema({
    users: Array,
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    notes: { type: String, required: true },
    quotas: { type: Number, required: true },
    testTechnical: { type: String, required: true },
    journey: { type: Number, required: true },
});

const Citation = model("Citation", CitationSchema);

module.exports = Citation;
