const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		type: String
	},
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

	// /* Agora */

	// outcome: {
	// 	outcome1: {
	// 		generalcomment: {
	// 			type: String,
	// 		},
	// 		techcomment: {
	// 			type: String,
	// 		},
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	outcome2: {
	// 		generalcomment: {
	// 			type: String,
	// 		},
	// 		techcomment: {
	// 			type: String,
	// 		},
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	outcome3: {
	// 		generalcomment: {
	// 			type: String,
	// 		},
	// 		techcomment: {
	// 			type: String,
	// 		},
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	outcome4: {
	// 		generalcomment: {
	// 			type: String,
	// 		},
	// 		techcomment: {
	// 			type: String,
	// 		},
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	outcome5: {
	// 		generalcomment: {
	// 			type: String,
	// 		},
	// 		techcomment: {
	// 			type: String,
	// 		},
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	outcome6: {
	// 		generalcomment: {
	// 			type: String,
	// 		},
	// 		techcomment: {
	// 			type: String,
	// 		},
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// },

	// badges: {
	// 	badges1: {
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	badges2: {
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	badges3: {
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	badges4: {
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// 	badges5: {
	// 		aprove: {
	// 			type: Boolean,
	// 			default: true,
	// 		},
	// 	},
	// },

	// /* fin Agora */

	// /* mentoria */

	// gender: {
	// 	type: Number,
	// },

	// mentorAssigment: {
	// 	type: String,
	// },

	// prev_studes: {
	// 	type: String,
	// },

	// actualAge: {
	// 	type: Number,
	// },
	// sesiones: {
	// 	type: Number,
	// },

	// interest: {
	// 	type: Array,
	// 	require: true,
	// },

	// /* fin mentoria */

	// /* Social Programate */

	// experience: {
	// 	type: "string",
	// 	trim: true,
	// 	lowercase: true,
	// },
	// description: {
	// 	type: "string",
	// 	trim: true,
	// 	lowercase: true,
	// },
	// github: {
	// 	type: "string",
	// 	trim: true,
	// 	lowercase: true,
	// },
	// softSkills: {
	// 	type: "string",
	// 	trim: true,
	// 	lowercase: true,
	// },
	// technicalSkills: {
	// 	type: "string",
	// 	trim: true,
	// 	lowercase: true,
	// },

	// /* fin social programate */

	/* Proceso de seleccion */

	// status: 
	//	registered: type: Boolean ,
	//	waitList:  type: Boolean ,
	//	withCitation:  type: Boolean ,
	//	booked:  type: Boolean ,
	//	interviewed:  type: Boolean ,
	//	pass:  type: Boolean ,
	//	noPass: type: Boolean , 
	//},
	// heardFromUs: {
	//     web: Boolean,
	//     recommendation: Boolean,
	//     facebook: Boolean,
	//     instagram: Boolean,
	//     google: Boolean,
	//     compensar: Boolean,
	//     allianceEducational: Boolean,
	//     embassyVen: Boolean,
	//     poliTec: Boolean,
	//     PNUD: Boolean,
	//     other: Boolean,
	// },
	// // convocatoria: String,
	// // resultados: Number,
	// // fechaEntrevista: Date,
	// // urlPrueba: String,
	// // promedioEntrevista: Number,
	/* fin proceso seleccion  */
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
