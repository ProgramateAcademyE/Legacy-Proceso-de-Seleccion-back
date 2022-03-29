const Profile = require("../db/models/Profile");
const User = require("../db/models/User");
const Result = require("../db/models/Result");
const multer = require("multer");
const mimeTypes = require("mime-types");
const request = require("request");
const { ConnectionStates } = require("mongoose");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Citation = require("../db/models/Citation");
const { OAuth2 } = google.auth;

const candidateRouter = require("express").Router();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "programate.co@gmail.com", // generated ethereal user
    pass: "plltidxfuexzvfdr", // generated ethereal password
  },
});

// UPLOAD FILE PDF
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(
      "",
      Date.now() + file.originalname + "." + mimeTypes.extension(file.mimetype)
    );
  },
});
const upload = multer({
  storage: storage,
});




// GET CALIFACATION
candidateRouter.get("/calification", async (req, res) => {
  const calification = await Result.find();
  res.send(calification);
});

candidateRouter.get("/result/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Result.find({ user_id: id });
  res.send(result);
});

// CREATES A NEW USER
// candidateRouter.post("/new", async (req, res, next) => {
// 	const {
// 		firstName,
// 		secondName,
// 		firstSurname,
// 		secondSurname,
// 		email,
// 		phone1,
// 		rol,
// 	} = req.body;
// 	const newUser = new User({
// 		firstName,
// 		secondName,
// 		firstSurname,
// 		secondSurname,
// 		email,
// 		phone1,
// 		rol,
// 	});
// 	await newUser.save();
// 	res.send(`${User.firstName} saved`);
// });


// CREATE THE PROFILE OF A USER
candidateRouter.post(
	"/profile",
	upload.single("pdf"),
	async (req, res, next) => {
		const {
			user_id,
			firstName,
			secondName,
			firstSurname,
			secondSurname,
			documentType,
			documentNumber,
			documentPdf,
			phone1,
			phone2,
			nacionality,
			residencyDepartment,
			municipalityOfResidency,
			locationInBogota,
			Stratum,
			email,
			sex,
			age,
			address,
			dateOfBirth,
			currentCountry,
			areaType,
			billPdf,
			disability,
			familyIncome,
			householdMembers,
			numberOfChildren,
			internetCompany,
			mbCount,
			internetAccess,
			maritalStatus,
			vulnerablePopulation,
			academicLevel,
			studiesPdf,
			cvPdf,
			degreeTitle,
			currentOccupation,
			unemployementTime,
			contractWorker,
			householder,
			firstLanguage,
			secondLanguage,
			languageLevel,
			pcAccess,
			motivationLetter,
			soloLearnProfile,
			// heardFromUs: {
			//     web,
			//     recommendation,
			//     facebook,
			//     instagram,
			//     google,
			//     compensar,
			//     allianceEducational,
			//     embassyVen,
			//     poliTec,
			//     PNUD,
			//     other
			// },
			
		} = req.body;
		console.log(req.body);
		const newProfile = new Profile({
			user_id,
			firstName,
			secondName,
			firstSurname,
			secondSurname,
			documentType,
			documentNumber,
			documentPdf,
			phone1,
			phone2,
			nacionality,
			residencyDepartment,
			municipalityOfResidency,
			locationInBogota,
			Stratum,
			email,
			sex,
			age,
			address,
			dateOfBirth,
			currentCountry,
			areaType,
			billPdf,
			disability,
			familyIncome,
			householdMembers,
			numberOfChildren,
			internetCompany,
			mbCount,
			internetAccess,
			maritalStatus,
			vulnerablePopulation,
			academicLevel,
			studiesPdf,
			cvPdf,
			degreeTitle,
			currentOccupation,
			unemployementTime,
			contractWorker,
			householder,
			firstLanguage,
			secondLanguage,
			languageLevel,
			pcAccess,
			motivationLetter,
			soloLearnProfile,
			// heardFromUs: {
			//     web,
			//     recommendation,
			//     facebook,
			//     instagram,
			//     google,
			//     compensar,
			//     allianceEducational,
			//     embassyVen,
			//     poliTec,
			//     PNUD,
			//     other
			// },
			// status,
		});
		await newProfile.save();
		res.send(`${Profile.user_id} profile saved`);
	},
);

// GET ALL CANDIDATES
candidateRouter.get("/candidate", async (req, res) => {
  const candidates = await User.find();
  res.send(candidates);
});
// GET ALL PROFILES 
candidateRouter.get("/candidate-profile", async (req, res) => {
	try {
    const candidateProfile = await Profile.find();
    res.send(candidateProfile);
	} catch {
		res.status(404).send({error: "ERROR" })
	}
});

// GET PROFILE OF CANDIDATES
candidateRouter.get("/candidate-profile/:id", async (req, res) => {
  const id = req.params.id;
  // Data from de candidate document
  const candidate = await User.find({ user_id: id });
  // Data from the profile of the candidate
  const candidateProfile = await Profile.find({ user_id: id });
  // Strucuture for required data

  //res.send(candidate[0].name);

	const candidateProfileData = {
		firstName: candidate[0].firstName,
		secondName: candidate[0].secondName,
		firstSurname: candidate[0].firstSurname,
		secondSurname: candidate[0].secondSurname,

		email: candidate[0].email,
		phone1: candidate[0].phone1,
		phone2: candidate[0].phone2,

		documentType: candidateProfile[0].documentType,
		documentNumber: candidateProfile[0].documentNumber,
		documentNumber: candidateProfile[0].documentPdf,

		nacionality: candidateProfile[0].nacionality,
		locationInBogota: candidateProfile[0].locationInBogota,
		residencyDepartment: candidateProfile[0].residencyDepartment,
		municipalityOfResidency: candidate[0].municipalityOfResidency,
		Stratum: candidateProfile[0].Stratum,
		age: candidateProfile[0].age,
		sex: candidateProfile[0].sex,
		
		billPdf: candidateProfile[0].billPdf,
		dateOfBirth: candidateProfile[0].dateOfBirth,
		currentCountry: candidateProfile[0].currentCountry,
		areaType: candidateProfile[0].areaType,
		address: candidateProfile[0].address,
		disability: candidateProfile[0].disability,
		familyIncome: candidateProfile[0].familyIncome,
		householdMembers: candidateProfile[0].householdMembers,
		numberOfChildren: candidateProfile[0].numberOfChildren,
		internetCompany: candidateProfile[0].internetCompany,
		mbCount: candidateProfile[0].mbCount,
		internetAccess: candidateProfile[0].internetAccess,


		maritalStatus: candidateProfile[0].maritalStatus,
		academicLevel: candidateProfile[0].academicLevel,
		vulnerablePopulation: candidateProfile[0].vulnerablePopulation,

		studiesPdf: candidateProfile[0].studiesPdf,
		cvPdf: candidateProfile[0].cvPdf,
		



		degreeTitle: candidateProfile[0].degreeTitle,
		currentOccupation: candidateProfile[0].currentOccupation,
		unemployementTime: candidateProfile[0].unemployementTime,
		contractWorker: candidateProfile[0].contractWorker,
		householder: candidateProfile[0].householder,
		pcAccess: candidateProfile[0].pcAccess,
		secondLanguage: candidateProfile[0].secondLanguage,
		languageLevel: candidateProfile[0].languageLevel,
		firstLanguage: candidateProfile[0].firstLanguage,
		motivationLetter: candidateProfile[0].motivationLetter,
		soloLearnProfile: candidateProfile[0].soloLearnProfile,
	};
	res.send({
		data: {
			candidateProfileData,
		},
	});
});

// update a motivation letter by id
candidateRouter.put("/motivation-letter-update/:id", async (req, res) => {
    try {
        
		const user_id = req.params.id;
		const { motivationLetter}  = req.body;
		console.log(req.body)
       	await Profile.findOneAndUpdate( {user_id:user_id}, {motivationLetter} );
		
		
		
        res.json({ msg: 'Carta de motivacion actualizada con exito' });
	} catch (e) {
		res.status(404).send({ error: e })
	}
});



// CREATE RESULTS
candidateRouter.post("/new-result", async (req, res) => {
  try {
    // Viariables destructuring from req.body
    const {
      user_id,
      htmlScore,
      cssScore,
      javascriptScore,
      pythonScore,
      soloLearnScore,
      personalProfileScore,
      motivationScore,
      finalScore,
      pass,
    } = req.body;
    // Viariables destructuring from user names

		const candidate = await Profile.findById(user_id);
		const { firstName, secondName, firstSurname, secondSurname } = candidate;
		// Creating full name
		const userFullName = `${firstName} ${secondName} ${firstSurname} ${secondSurname}`;

    // Creating new Result document
    const newResult = new Result({
      user_id,
      userFullName,
      htmlScore,
      cssScore,
      javascriptScore,
      pythonScore,
      soloLearnScore,
      personalProfileScore,
      motivationScore,
      finalScore,
      pass,
    });
    console.log(newResult);
    // Saving new document to Reults
    await newResult.save();
    res.send({ data: newResult });
  } catch {
    res.status(404).send({ error: "Candidate not found" });
  }
});

// PUT OF CANDIDATE PASSES
// Recibe el user_id, y los objetos de la parte que se desee actualizar
// candidate actualiza los datos basicos del registro
// profile actualiza los datos del formulario
candidateRouter.put("/update-candidate", async (req, res) => {
  try {
    const { user_id, candidate, profile } = req.body;
    if (candidate) {
      const candidate = await User.updateMany(
        { user_id: user_id },
        {
          $set: req.body.candidate,
        }
      );
    }
    if (profile) {
      const candidateProfile = await Profile.updateMany(
        { user_id: user_id },
        {
          $set: req.body.profile,
        }
      );
    }
    res.send({ data: candidate });
  } catch {
    res.status(404).send({ error: "Candidate not found" });
  }
});

const oAuth2Client = new OAuth2(
  "169447507213-pp77cjt1i0miu0fsfea1dson2vuvnvn7.apps.googleusercontent.com",
  "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"
);

oAuth2Client.setCredentials({
  refresh_token:
    "1//04ZNl89icy8DvCgYIARAAGAQSNwF-L9IrNd0_kBCZJnJEGfmgq7YzNwTS4nHx8eIOzBAQTGXMb5ZzTWznLUOWc0pz0uWC0BgiIhU",
});

// SAVE AND UPDATE SOLOLEARN DATA
candidateRouter.get("/sololearm/:id", async (req, res) => {
  var id = req.params.id;
  const perfiles = await Profile.find({ user_id: id });
  console.log("uno", perfiles);
  const params = JSON.stringify(perfiles);
  const json = JSON.parse(params);
  console.log("dos", json);
  for (x of json) {
    var usersololearm = x.soloLearnProfile;
    console.log("tres", x);
    console.log(usersololearm);
  }
  console.log("hola", usersololearm);
  if (usersololearm === undefined) {
    console.log("This user does not have a sololearn profile");
  } else {
    const calificationUpdate = await Result.find({ user_id: id });
    const params2 = JSON.stringify(calificationUpdate);
    const json2 = JSON.parse(params2);
    for (y of json2) {
      var users_id = y.user_id.toString();
    }
    console.log("mm", users_id);
    request(
      `https://api.sololearn.repl.co/profile/${usersololearm}`,
      async (err, response, body) => {
        if (!err) {
          const user = JSON.parse(body);
          var name = user.userDetails.name;
          var html = 0;
          var css = 0;
          var javascript = 0;
          var python = 0;
          for (let i = 0; i < user.coursesProgress.length; i++) {
            if (user.coursesProgress[i].courseId === 1023) {
              css = user.coursesProgress[i].progress;
            } else if (user.coursesProgress[i].courseId === 1172) {
              python = user.coursesProgress[i].progress;
            } else if (user.coursesProgress[i].courseId === 1014) {
              html = user.coursesProgress[i].progress;
            } else if (user.coursesProgress[i].courseId === 1024) {
              javascript = user.coursesProgress[i].progress;
            }
            console.log(user.coursesProgress[i].courseName + " " + user.coursesProgress[i].progress);
          }
          var p = (html + css + javascript + python) / 4;
          const {
            user_id = id,
            userFullName = name,
            htmlScore = html,
            cssScore = css,
            javascriptScore = javascript,
            pythonScore = python,
            soloLearnScore = p.toFixed(2),
          } = req.body;
          const usersolo = new Result({
            user_id,
            userFullName,
            htmlScore,
            cssScore,
            javascriptScore,
            pythonScore,
            soloLearnScore,
          });
          if (users_id === undefined) {
            await usersolo.save();
          } else {
            await Result.updateOne(
              { user_id: id },
              {
                $set: {
                  htmlScore: html,
                  cssScore: css,
                  javascriptScore: javascript,
                  pythonScore: python,
                  soloLearnScore: p.toFixed(2),
                },
              }
            );
            console.log("Updated successfully");
          }
        } else {
          console.log("Error" + err.message);
        }
      }
    );
  }
  res.send("seving datas");
});

candidateRouter.post("/attendevent/:id/:idevent", async (req, res) => {
  var id = req.params.id;
  const perfiles = await Profile.find({ user_id: id });
  const params = JSON.stringify(perfiles);
  const json = JSON.parse(params);
  for (z of json) {
    var userid = z.user_id.toString();
  }

  var idevent = req.params.idevent;
  const event = await Citation.find({ _id: idevent });
  const params3 = JSON.stringify(event);
  const json3 = JSON.parse(params3);
  var id_user = [];
  for (t of json3) {
    var id_evnet = t._id.toString();
    id_user = t.users;
    var link = t.link.toString();
    var testTechnical = t.testTechnical.toString();
    var title = t.title.toString();
    var subject = t.notes.toString();
    var fechasinicio = t.start.toString();
    var fechafinal = t.end.toString();
    var quotas = t.quotas;
  }

  const dataencontrada = id_user.includes(id);
  const accountant = id_user.length;

  if (dataencontrada === false && accountant < quotas) {
    await Citation.updateOne(
      { _id: id_evnet },
      {
        $push: {
          users: { $each: [userid] },
        },
      }
    );

    const us = await User.find({ _id: id });
    const params4 = JSON.stringify(us);
    const json4 = JSON.parse(params4);
    for (u of json4) {
      var emails = u.email;
    }
    transporter.sendMail({
      from: title + "<programate.co@gmail.com>", // sender address
      to: emails, // list of receivers
      subject: subject, // Subject line
      html:
        "Fecha de la entrevista:" +
        fechasinicio +
        " " +
        fechafinal +
        "<br>" +
        "Link de conexión: " +
        link +
        "<br>" +
        "El día de la entrevista:" +
        "<br>" +
        "Ten tu documento de identidad a la mano." +
        "<br>" +
        "Llega 5 minutos antes de la sesión, al principio de la sesión vamos a explicar la dinámica de toda la entrevista." +
        "<br>" +
        "Asegúrate de tener conexión a internet durante la entrevista, es necesario que tengas la cámara encendida durante toda la sesión" +
        "<br>" +
        "Cuando ingreses a la entrevista, pon tu nombre completo (nombre y apellido, no apodos) para que sea visible para todos en la reunión" +
        "<br>" +
        "Te recomendamos conectarte desde tu computador, ya que vas a ingresar a otras páginas durante la sesión" +
        "<br>" +
        "Nos vamos a conectar por Zoom, descarga la aplicación." +
        "<br>" +
        "Adjunto te compartimos un ejercicio práctico que debes hacer antes del día de tu entrevista para que nos cuentes cómo te fue haciéndolo." +
        "<br>" +
        testTechnical, // html body
    });
    res.send("user registered successfully and send email successfully");
  } else {
    console.log("el usuario esta registrado o ya no hay cupo");
    res.send("el usuario esta registrado o ya no hay cupo");
  }
});

candidateRouter.put("/updatetest/:id", async (req, res) => {
  const id = req.params.id;
  const findperfil = await Profile.find({ user_id: id });
  const params = JSON.stringify(findperfil);
  const json = JSON.parse(params);
  for (h of json) {
    var userid = h.id.toString();
  }
  const updateEvent = await Profile.findByIdAndUpdate(userid, req.body, {
    new: true,
  });
  res.status(200).json(updateEvent);
});

candidateRouter.get("/calendar", async (req, res) => {
  const events = await Citation.find();

  console.log(events);
  res.send(events);
});

candidateRouter.get("/infoperfil/:id", async (req, res) => {
  const id = req.params.id;
  const findperfil = await Profile.find({ user_id: id });
  const params = JSON.stringify(findperfil);
  const json = JSON.parse(params);
  for (h of json) {
    var ids = h.id.toString();
  }
  const perfil = await Profile.findById(ids);
  res.send(perfil);
});

module.exports = candidateRouter;
