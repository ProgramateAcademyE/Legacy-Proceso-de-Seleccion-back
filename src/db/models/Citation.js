const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CitationSchema = new Schema({
/** 	users: Array,
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	title: { type: String, required: true },
	link: { type: String, required: true },
	notes: { type: String, required: true },
	quotas: { type: Number, required: true },
	testTechnical: { type: String, required: true },
	journey: { type: Number, required: true },
}); */

	id: {
		type: Number,
	},
	appointmentDate: { // fecha de entrevista
		type: Date,
	},
	shift: { // jornada
		type: ["mañana", "tarde"],
		default: "mañana"
	},
	applicantQuota: {  // cantidad de aspirantes
		type:Number,
	},
	enrolledNumber: { // cantidad de inscritos
		type: Number,
		count: 0
	},
	titleConvocatory: { // titulo de la convocatoria
		type: String,
	},
	shiftStart: { // hora de inicio
		type: Number,
		required: true 
	},
	shiftEnd: { // hora de finalizacion
		type: Number,
		required: true
	},
	notes: { // informacion adicional
		type: String,
		 required: true
	},

});

const Citation = model("Citation", CitationSchema);

module.exports = Citation;
	