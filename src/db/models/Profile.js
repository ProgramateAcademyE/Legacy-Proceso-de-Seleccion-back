const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		type: String
	},
	/* Proceso de seleccion */

	firstName: {
		type: String,
	},
	secondName: {
		type: String,
	},
	firstSurname: {
		type: String,
	},
	secondSurname: {
		type: String,
	},
	documentType: {
		type: String,
	},
	documentNumber: {
		type: Number,

	},
	documentPdf: {
		type: String,
	},
	age: {
		type: Number,
	},
	sex: {
		type: String,
    },
	nacionality: {
		type: String,
	},
	residencyDepartment: {
		type: String,
	},
	municipalityOfResidency: {
		type: String,
	},
	locationInBogota:{
		type: String,
	},
	Stratum: {
		type: Number,
	},
	phone1: {
		type: Number,
	},
	phone2: {
		type: Number,
	},
	email: {
		type: String,
		unique: true,
	},
	dateOfBirth: {
		type: Date,
	},

	maritalStatus: {
		type: String,
	},
	currentCountry: {
		type: String,
	},
	address: {
		type: String,
		
	},
	areaType: {
		type: String,
	},
	
	billPdf: {
		type: String,

	},
	disability: {
		type: [], //array
	},
	pcAccess: {
		type: String,
	},
	familyIncome: {
		type: String,
	},
	householdMembers: { 
		type: String,

	},
	numberOfChildren: {
		type: String,

	},
	internetCompany: {
		type: String,

	},
	mbCount: {
		type: Number,

	},
	internetAccess: {
		type: String,
	},
	vulnerablePopulation: { // array
		type: [],

	},
	degreeTitle: {
		type: String,

	},
	academicLevel: {
		type: String,

	},
	studiesPdf: {
		type: String,
	},
	cvPdf: {
		type: String,
	},
	unemployementTime: {
		type: String,
	},
	currentOccupation: {
		type: String,

	},
	contractWorker: {
		type: String,

	},
	householder: {
		type: String,

	},
	firstLanguage: {
		type: String,

	},
	secondLanguage: {
		type: String,

	},
	languageLevel: {
		type: String,

	},
	soloLearnProfile: {
		type: Number,
		minlength: 6,
	},
	motivationLetter : {
		type: String,
	},
});

profileSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
