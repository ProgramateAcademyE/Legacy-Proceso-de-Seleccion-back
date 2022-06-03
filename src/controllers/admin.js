const Convocatory = require("../db/models/Convocatory");
const Result = require("../db/models/Result");
const Profile = require("../db/models/Profile");
const User = require("../db/models/User");
const Rooms = require("../db/models/Rooms");
const adminRouter = require("express").Router();
const request = require("request");
const Administrator = require("../db/models/Administrators");
const Citation = require("../db/models/Citation");
const Questionary = require("../db/models/Questionary");
const Meet = require("../db/models/Meet");
const Availability = require("../db/models/Availability");
const ObjectId = require("mongodb").ObjectID;
const Test = require("../db/models/TechTest");
const InterviewDay = require("../db/models/InterviewDay");
const auth = require("../middleware/auth");
const { ObjectID } = require("bson");

// ===================== Tech Test Endpoints =======================
// Get all tech test
adminRouter.get("/test", async (req, res) => {
  const results = await Test.find();
  res.send(results);
});

// Get one tech test
adminRouter.get("/test/:id", async (req, res) => {
  const results = await Test.find({ _id: req.params.id });
  res.send(results);
});

// Delete one tech test
adminRouter.delete("/test/:id", async (req, res) => {
  await Test.findByIdAndDelete({ _id: req.params.id });
  res.send({ msg: "Eliminado con exito" });
});

// Create new tech test
adminRouter.post("/new-test", async (req, res) => {
  try {
    const { title, url, pdf, convocatories } = req.body;

    const newTest = new Test({
      title,
      url,
      pdf,
      convocatories,
    });

    await newTest.save();
    res.status(200).json({ msg: "Convocatoria creada con exito" });
  } catch (error) {
    res.status(400).json({ msg: `No se pudo crear la convocatoria ${error}` });
  }
});

//Update tech test
adminRouter.put("/test/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    Object.assign(test, req.body);
    test.save();
    res.status(200).send({ msg: "Prueba actualizada exitosamente" });
  } catch (error) {
    res.status(404).send({ error: `Error ${error}` });
  }
});

// =====================================================================

// ===================== Convocatories Endpoints =======================

// CREATES NEW CONVOCATORY
adminRouter.post("/new-conv", async (req, res, next) => {
  try {
    // DATA REQUIRED FROM REQUEST
    const {
      name,
      initialDate,
      finalDate,
      maxQuotas,
      initialBootcampDate,
      finalBootcampDate,
      parameterization,
      residenceCountry,
      residencyDepartment,
      maxAge,
      maxSocioeconomicStratus,
      gender,
      typePopulation,
    } = req.body;

    // New Convocatory document
    const newConvocatory = new Convocatory({
      name,
      initialDate,
      finalDate,
      maxQuotas,
      initialBootcampDate,
      finalBootcampDate,
      parameterization,
      residenceCountry,
      residencyDepartment,
      maxAge,
      maxSocioeconomicStratus,
      gender,
      typePopulation,
    });

    await newConvocatory.save();
    res.json({ msg: "Convocatoria creada con exito" });
  } catch (error) {
    res.json({ msg: `Algo fallo ${error}` });
  }
});

// UPDATE CONVOCATORY
adminRouter.put("/update-conv/:id", async (req, res) => {
  try {
    const convocatory = await Convocatory.findById(req.params.id);
    Object.assign(convocatory, req.body);
    convocatory.save();
    res.json({ msg: "Convocatoria actualizada con exito" });
  } catch {
    res.status(404).send({ error: "Convocatory not found" });
  }
});

// Add candidate to convocatory
adminRouter.patch("/update-candidate/:id", auth, async (req, res) => {
  try {
    const { usersRegistered } = req.body;

    await Convocatory.findOneAndUpdate(
      { _id: req.params.id },
      {
        usersRegistered,
      }
    );
    res.send({ msg: "Te has registrado con exito" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// Get All convocatories
adminRouter.get("/convocatories", async (req, res) => {
  const results = await Convocatory.find();
  res.send(results);
});

//  Get One Convocatory
adminRouter.get("/convocatory/:id", async (req, res) => {
  const results = await Convocatory.find({ _id: req.params.id });
  res.send(results);
});

// delete convocatory
adminRouter.delete("/convocatory/:id", async (req, res) => {
  await Convocatory.findByIdAndDelete({ _id: req.params.id });

  res.send({ msg: "Eliminado con exito" });
});

// ======================================================================

// GET STATISTICS
adminRouter.get("/statistics", async (req, res) => {
  // Busca la convocatoria que se encuentra activa
  const convocatoryData = await Convocatory.find({ status: true });
  // Busca las citaciones para obtener datos de las fechas e inscritos
  const citationData = await Citation.find();
  // Objeto para guardar los campos
  const totalUsers = {
    total: convocatoryData[0].usersRegisted.length,
    residencyDepartment: {},
    women: 0,
    man: 0,
    other: 0,
    totalregistered: 0,
    totalwithCitation: 0,
    totalmigrants: 0,
    interviewed: 0,
    totalPass: 0,
    interviewDays: {},
    remainingToGoal: 0,
    heardFromUs: {},
  };
  for (let citation of citationData) {
    let date = citation.date.toString();
    date = date.split(" ").slice(1, 4).join("-");
    if (totalUsers.interviewDays[date]) {
      totalUsers.interviewDays[date] += citation.users.length;
    } else {
      totalUsers.interviewDays[date] = citation.users.length;
    }
  }
  // Ciclo para extraer la info de cada usuario registrado en la convocatoria
  for (let candidateId of convocatoryData[0].usersRegisted) {
    // Perfil del candidato
    const candidate = await Profile.find({ user_id: candidateId });
    // Total genero: 0-Mujer, 1-Hombre, 2-Otro
    // Busca si la propiedad existe y aumenta 1, sino lo agrega con el valor 1
    if (candidate[0].gender === 0) {
      if (totalUsers.women) {
        totalUsers.women += 1;
      } else {
        totalUsers.women = 1;
      }
    }
    if (candidate[0].gender === 1) {
      if (totalUsers.man) {
        totalUsers.man += 1;
      } else {
        totalUsers.man = 1;
      }
    }
    if (candidate[0].gender === 2) {
      if (totalUsers.other) {
        totalUsers.other += 1;
      } else {
        totalUsers.other = 1;
      }
    }
    // Total registrados en la convocatoria
    if (candidate[0].status.registered === true) {
      if (totalUsers.totalregistered) {
        totalUsers.totalregistered += 1;
      } else {
        totalUsers.totalregistered = 1;
      }
    }
    // Total citados
    if (candidate[0].status.withCitation === true) {
      if (totalUsers.totalwithCitation) {
        totalUsers.totalwithCitation += 1;
      } else {
        totalUsers.totalwithCitation = 1;
      }
    }
    // Total entrevistados
    if (candidate[0].status.interviewed === true) {
      if (totalUsers.interviewed) {
        totalUsers.interviewed += 1;
      } else {
        totalUsers.interviewed = 1;
      }
    }
    // Total que pasaron el proceso
    if (candidate[0].status.pass === true) {
      if (totalUsers.totalPass) {
        totalUsers.totalPass += 1;
      } else {
        totalUsers.totalPass = 1;
      }
    }
    // Total de departamentos de residencia
    // Si el departamento no existe lo agrega, si existe le suma 1
    // En el objeto residencyDepartment en totalUsers
    const deparment = candidate[0].residencyDepartment;
    if (deparment) {
      if (totalUsers.residencyDepartment[deparment]) {
        totalUsers.residencyDepartment[deparment] += 1;
      } else {
        totalUsers.residencyDepartment[deparment] = 1;
      }
    }
    if (candidate[0].status.migrants === true) {
      if (totalUsers.totalmigrants) {
        totalUsers.totalmigrants += 1;
      } else {
        totalUsers.totalmigrants = 1;
      }
    }
    if (candidate[0].heardFromUs) {
      for (const [key, value] of Object.entries(candidate[0].heardFromUs)) {
        if (value) {
          if (totalUsers.heardFromUs[key]) {
            totalUsers.heardFromUs[key] += 1;
          } else {
            totalUsers.heardFromUs[key] = 1;
          }
        }
      }
    }
  }
  // Check how many to remains to goal
  if (totalUsers.totalPass < convocatoryData[0].maxQuotas) {
    const goal = convocatoryData[0].maxQuotas - totalUsers.totalPass;
    totalUsers.remainingToGoal = goal;
  } else {
    totalUsers.remainingToGoal = 0;
  }
  res.json({
    data: totalUsers,
  });
});

// GET THE RESULTS OF CANDIDATE
adminRouter.get("/get-result/:id", async (req, res) => {
  try {
    const { user_id } = req.params.id;
    const candidateProfile = await Profile.find({ user_id: user_id });
    let { soloLearnProfile } = candidateProfile[0];

    // Fetching Solo learn data
    try {
      request(
        `https://api.sololearn.repl.co/profile/${soloLearnProfile}`,
        (err, response, body) => {
          if (!err) {
            const candidate = JSON.parse(body);
            scores = candidate.coursesProgress.map((course) => [
              course.courseName,
              course.progress,
            ]);
            const objScores = Object.fromEntries(scores);
            res.json({ data: objScores });
          }
        }
      );
    } catch {
      res.json({ error: "Error fetching data" });
    }
  } catch {
    res.status(404).send({ error: "Candidate not found" });
  }
});

// GET THE LIST OF CANDIDATES IN WAIT LIST
// adminRouter.get("/waiting-list", async (req, res, next) => {
//         const waitList = await Profile.find({ status: { waitList: true } });
//         res.send({ data: waitList });
// });
// ============================ HIRMOMI DANI =========================

adminRouter.get("/results", async (req, res, next) => {
  const results = await Result.find();
  res.send({ data: results });
});

adminRouter.get("/waiting-list", async (req, res, next) => {
  let waitList = await Profile.find();
  waitList = waitList.filter((candidate) => candidate.status.waitList === true);
  let waitListResults = [];
  for (let candidate of waitList) {
    let candidateData = await Result.find({
      user_id: candidate.user_id,
    });
    const candidateName = await User.find({
      _id: ObjectId(candidate.user_id),
    });
    if (candidateData[0] !== undefined) {
      candidateData = candidateData.map((candidate) =>
        candidate
          ? {
              sololearn: candidate.soloLearnScore,
              personal: candidate.personalProfileScore,
              motivation: candidate.motivation,
              final: candidate.finalScore,
              status: candidate.status,
            }
          : null
      );
      console.log(candidateData);
      const candidateObj = {
        ID: candidate.user_id,
        Nombre: `${candidateName[0].firstName} ${candidateName[0].surname}`,
        sololearn: candidateData[0].sololearn,
        personal: candidateData[0].personal,
        motivation: candidateData[0].motivation,
        final: candidateData[0].final,
        Status: candidateData[0].status,
      };
      waitListResults.push(candidateObj);
    }
  }
  res.json({
    data: waitListResults,
  });
});

// ============================ HIRMOMI DANI =========================

// Download CSV files
adminRouter.post("/csv/", async (req, res) => {
  // Data from de candidate document
  const candidates = await User.find();
  // Data from the profile of the candidate
  const candidateProfiles = await Profile.find();
  // Strucuture for required data
  const csvObject = [];

  for (let c of candidates) {
    const candidateProfileData = {
      firstName: candidates[0].firstName,
      middleName: candidates[0].middleName,
      surname: candidates[0].surname,
      secondSurname: candidates[0].Surname,
      fullName: `${candidates[0].firstName} ${candidates[0].surname}`,
      documentType: candidateProfiles[0].documentType,
      documentNumber: candidateProfiles[0].documentNumber,
      email: candidates[0].email,
      contactNumber: candidates[0].contactNumber,
      nacionality: candidateProfiles[0].nacionality,
      residenceCountry: candidateProfiles[0].residenceCountry,
      residencyDepartment: candidateProfiles[0].residencyDepartment,
      municipalityOfResidency: candidates[0].municipalityOfResidency,
      socioeconomicStratus: candidateProfiles[0].socioeconomicStratus,
      actualAge: candidateProfiles[0].actualAge,
      gender: candidateProfiles[0].gender,
      status: "true",
    };
    csvObject.push(candidateProfileData);
  }
  const csvFromArrayOfObjects = convertArrayToCSV(csvObject);
  res.json({ data: csvFromArrayOfObjects });
});

// Updates the parameters for actual convocatory
adminRouter.put("/parameterization/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await Convocatory.updateMany(
      { _id },
      {
        $set: {
          parameterization: {
            personalProfile: req.body.parameterization.personalProfile,
            sololearn: req.body.parameterization.sololearn,
            motivationLetter: req.body.parameterization.motivationLetter,
          },
          residenceCountry: req.body.residenceCountry,
          residencyDepartment: req.body.residencyDepartment,
          maxAge: req.body.maxAge,
          maxSocioeconomicStratus: req.body.maxSocioeconomicStratus,
        },
      }
    );
    res.send([_id, result]);
  } catch {
    res.status(404).send({ error: "parameterization category not put" });
  }
});
// ============================ HIRMOMI DANI =========================

//GET ALL CANDIDATES
adminRouter.get("/candidatefull", async (req, res) => {
  const candidates = await Profile.find({}).populate("user_id");
  res.send(candidates);
});

// Get all citations
adminRouter.get("/citation", async (req, res) => {
  const citations = await Citation.find();

  async function getUserData(users) {
    const usersInfo = [];
    for (let user of users) {
      const info = await User.find({ _id: ObjectId(user) });
      usersInfo.push(info[0]);
    }
    return usersInfo;
  }

  let data = citations.map((citation, idx) =>
    citation
      ? {
          id: idx,
          start: citation.start,
          finish: citation.end,
          journey: citation.journey,
          quotas: citation.quotas,
          quotasCompleted: citation.users.length,
          users: citation.users,
        }
      : null
  );

  const infoUsers = await Promise.all(
    data.map(async (obj) => getUserData(obj.users))
  );
  data.users = data.map((user, idx) => (user.users = infoUsers[idx]));
  res.send(data);
});

adminRouter.get("/acept", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

// ============================ Endpoints citation =========================

// Creates new citations
adminRouter.post("/citation", async (req, res) => {
  const {
    id,
    appointmentDate,
    shift,
    applicantQuota,
    enrolledNumber,
    titleConvocatory,
    shiftStart,
    shiftEnd,
    notes,
  } = req.body;
  const citation = new Citation({
    id,
    appointmentDate,
    shift,
    applicantQuota,
    enrolledNumber,
    titleConvocatory,
    shiftStart,
    shiftEnd,
    notes,
  });
  await citation.save();
  res.send("citacion guardada");
  res.status(404).send({ error: "ERROR" });
});

// list all citation data
adminRouter.get("/citation-all", async (req, res) => {
  try {
    console.log("citation");
    const data = await Citation.find({});
    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});

// update a record by id
adminRouter.put("/citation-update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      appointmentDate,
      shift,
      applicantQuota,
      enrolledNumber,
      titleConvocatory,
      shiftStart,
      shiftEnd,
      notes,
    } = req.body;
    await Citation.findOneAndUpdate(
      { id: id },
      {
        appointmentDate,
        shift,
        applicantQuota,
        enrolledNumber,
        titleConvocatory,
        shiftStart,
        shiftEnd,
        notes,
      }
    );
    res.json({ msg: "Registro actualizado con exito" });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});

// get a single record by id
adminRouter.get("/citation-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Citation.find({ id: id });
    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});
// delete a record by id
adminRouter.delete("/citation-delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Citation.deleteOne({ id });
    res.send("Registro eliminado con exito");
  } catch (e) {
    res.status(404).send({ res, error: "ERROR" });
  }
});

// ==============================================================

// ============================ Endpoints MAvailability =========================

/* Finding the availability of a citationID. */
adminRouter.get("/available-id/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Availability.find({ citationID: id });
    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});

/* Updating the availability model with the new values. */
adminRouter.put("/update_availables/:id", async (req, res) => {
  console.log("params", req.params.id);
  console.log(" body", req.body);
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const updateEvent = await Availability.findByIdAndUpdate(
    { _id: req.params.id },
    { selectors: values }
  );
});

/* Creating a new availability and saving it to the database. */
adminRouter.post("/availability", async (req, res) => {
  const body = req.body;
  console.log(req.body);
  const newAvailability = new Availability({
    ...body,
  });
  await newAvailability.save();
  res.send("Reunion guardada");
  res.status(404).send({ error: "ERROR" });
});

/* Deleting the availability from the database. */
adminRouter.delete("/deleteAvailability/:_id", async (req, res) => {
  console.log(req.params.id_available);
  try {
    await Availability.findByIdAndRemove({ _id: req.params._id });

    res.send({ msg: "Perfil eliminado de la base de datos. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// ============================ Endpoints Interview Day =========================

/* Creating an array of new Interview Day  and saving it to the database. */
adminRouter.post("/interviewDay-Observer", async (req, res) => {
  const body = Object.values(req.body);

  async function findInterview(meetID, userID) {
    const tmp = await InterviewDay.aggregate([
      {
        $match: {
          $and: [
            { meetID: meetID },
            {
              userID: userID,
            },
          ],
        },
      },
    ]);
    return tmp;
  }

  const validateDocuments = await Promise.all(
    body.map((d) => findInterview(d.meetID, d.userID))
  );

  const validateArray = validateDocuments.map((d) => d[0]);

  const finalToDo = validateArray.map((d, index) => {
    return d === undefined
      ? { ...body[index], toDo: "create" }
      : { ...d, toDo: "update" };
  });

  const newBody = finalToDo.map((d, index) => {
    if (d.toDo === "create") {
      return {
        ...d,
        assesmentScore: d.observers.score,
        observers: [d.observers],
        interviewDayScore: d.observers.score,
      };
    }

    if (d.toDo === "update") {
      const tmp = { ...d, observers: [...d.observers, body[index].observers] };
      const assesmentScore =
        tmp.observers.map((o) => o.score).reduce((a, b) => a + b, 0) /
        tmp.observers.length;

      const interviewDayScore = (assesmentScore + tmp.interviewScore) / 2;

      return {
        ...tmp,
        assesmentScore: assesmentScore,
        interviewDayScore: interviewDayScore,
      };
    }
  });

  async function createDocument(newDocument) {
    const newInterviewDay = new InterviewDay({
      ...newDocument,
    });
    await newInterviewDay.save();
  }

  async function updateDocument(newDocument) {
    await InterviewDay.findOneAndUpdate(
      { meetID: newDocument.meetID, userID: newDocument.userID },
      { ...newDocument }
    );
  }

  await Promise.all(
    newBody.map((d) =>
      d.toDo === "create" ? createDocument(d) : updateDocument(d)
    )
  );
  res.send("Reunion guardada");
  res.status(404).send({ error: "ERROR" });
});

/* Creating or updating a Interview Day Dcoument and saving it to the database. */
adminRouter.post("/interviewDay-Interviewer", async (req, res) => {
  const body = req.body;

  const validateDocument = await InterviewDay.find({
    meetID: body.meetID,
    userID: body.userID,
  });

  const newInterviewDay = new InterviewDay({
    interviewScore: body.interviewers.score,
    interviewDayScore: body.interviewers.score,
    interviewers: [body.interviewers],
    ...body,
  });

  if (validateDocument.length !== 0) {
    const current = validateDocument[0];
    const tmp = {
      current,
      interviewers: [...current.interviewers, body.interviewers],
    };

    const interviewScore =
      tmp.interviewers.map((i) => i.score).reduce((a, b) => a + b, 0) /
      tmp.interviewers.length;

    const interviewDayScore =
      (validateDocument[0].assesmentScore + interviewScore) / 2;
    await InterviewDay.findOneAndUpdate(
      { _id: validateDocument[0]._id },
      {
        ...body,
        interviewers: [...current.interviewers, body.interviewers],
        interviewScore: interviewScore,
        interviewDayScore: interviewDayScore,
      }
    );
  } else await newInterviewDay.save();

  res.send("Reunion guardada");

  res.status(404).send({ error: "ERROR" });
});

// ============================ Endpoints Meets =========================

/* Creating a new meet object and saving it to the database. */
adminRouter.post("/meet", async (req, res) => {
  const body = req.body;

  //console.log(body);
  const newMeet = new Meet({
    ...body,
    usersNumber: body.users.length,
    interviewersNumber: body.interviewers.length,
    observersNumber: body.observers.length,
  });

  const usersCopy1 = body.users.slice(0);
  const usersCopy2 = body.users.slice(0);

  function createRooms(users, selectors, roomsToCreate, roomName) {
    const roomsArr = [];

    for (let r = 0; r < roomsToCreate; r++) {
      roomsArr[r] = {
        roomName: `Sala ${roomName} ${r + 1}`,
        roomNumber: r + 1,
        users: [],
        selectors: [],
      };
    }
    //users
    let room = 0;
    while (users.length !== 0) {
      roomsArr[room].users.push(users.splice(-1)[0]);

      if (room === roomsToCreate - 1) {
        room = 0;
      } else room++;
    }
    // Selectors
    let room2 = 0;
    while (selectors.length !== 0) {
      const tmp = selectors.splice(-1)[0];
      roomsArr[room2].selectors.push(tmp);

      if (room2 === roomsToCreate - 1) {
        room2 = 0;
      } else room2++;
    }
    return roomsArr;
  }

  newMeet["roomsAssesments"] = createRooms(
    usersCopy1,
    body.observers,
    body.assesmentsRooms,
    "Assesment"
  );
  newMeet["roomsInterviewers"] = createRooms(
    usersCopy2,
    body.interviewers,
    body.interviewRooms,
    "Entrivistas"
  );

  await newMeet.save();
  res.send("Reunion guardada");
  res.status(404).send({ error: "ERROR" });
});

/* Getting all the meets from the database. */
adminRouter.get("/get-meets", async (req, res) => {
  try {
    const meet = await Meet.find();
    res.send(meet);
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
});

/* Getting the id from the url and then using that id to find the citationID in the database. */
adminRouter.get("/get-meet-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Meet.find({ citationID: id });
    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});

adminRouter.get("/get-meet-by-meetId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Meet.find({ _id: id });
    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});

adminRouter.get("/userMeets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const tmp = await Meet.aggregate([
      {
        $unwind: {
          path: "$roomsAssesments",
          includeArrayIndex: "roomsAssesmentsIndex",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$roomsAssesments.selectors",
          includeArrayIndex: "selectorsAssesmentsIndex",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$roomsInterviewers",
          includeArrayIndex: "roomsInterviewersIndex",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$roomsInterviewers.selectors",
          includeArrayIndex: "selectorsInterviewersIndex",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          $or: [
            {
              "roomsAssesments.selectors._id": id,
            },
            {
              "roomsInterviewers.selectors._id": id,
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
    ]);
    async function findMeet(id) {
      const meets = await Meet.find({ _id: id });
      return meets;
    }
    const data = await Promise.all(tmp.map((d) => findMeet(d._id))).then(
      (data) => {
        return data;
      }
    );

    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});

/// Questionario
adminRouter.get("/get-questionary/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Questionary.find({ _id: id });
    res.send({ data });
  } catch (e) {
    res.status(404).send({ error: "ERROR" });
  }
});
// =
// ==============================================================

// To upload the thecnical test for candidates
adminRouter.put("/upload-test", async (req, res) => {
  try {
    const _id = req.body;
    const result = await Convocatory.updateMany(
      { _id },
      {
        $set: {
          test: {
            nameTest: req.body.test.nameTest,
            linkTest: req.body.test.linkTest,
          },
        },
      }
    );
    res.send(result);
  } catch {
    res.status(404).send({ error: "link citation category not put" });
  }
});

/* The above code is a GET request that is used to retrieve a single citation from the database. */
adminRouter.get("/citationFilter/:IdCitation", async (req, res) => {
  try {
    const eachCitation = await Citation.findById(req.params.IdCitation);
    res.send({ eachCitation });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// Create assesments rooms for interview days
/*adminRouter.post("/create-room", async (req, res) => {
  const { citation_id } = req.body;
  const citationData = await Citation.find({ _id: citation_id });
  const staff = await Administrator.find({ available: true });
  const interviewersList = staff.filter(
    (person) => person.rol.interviewer === true
  );
  const observersList = staff.filter((person) => person.rol.observer === true);
  let room = [];

  for (let candidate of citationData[0].users) {
    let interviewersRandom = Math.floor(
      Math.random() * (interviewersList.length - 0) + 0
    );
    let interviewersFinals =
      interviewersList[interviewersRandom]._id.toString();

    let observersRandom = Math.floor(
      Math.random() * (observersList.length - 0) + 0
    );
    let observersFinals = observersList[observersRandom]._id.toString();
    room = [[candidate, interviewersFinals, observersFinals], ...room];
    console.log(room);
  }

  const rooms = new Rooms({
    citationData,
    interviewers: interviewersList,
    observers: observersList,
    room: room,
  });
  res.json({
    data: {
      rooms,
    },
  });
});*/

// Create administrators and staff users
/*adminRouter.post("/admin", async (req, res) => {
  const {
    firstName,
    surname,
    rol: { interviewer, observer, monitor },
    available,
  } = req.body;
  const admin = new Administrator({
    firstName,
    surname,
    rol: {
      interviewer,
      observer,
      monitor,
    },
    available,
  });
  await admin.save();
  res.send("profile saved");
});*/

// Get administrators and staff profiles
/*adminRouter.get("/admin", async (req, res) => {
  const results = await Administrator.find();
  res.send(results);
});*/

// create event in calendar
adminRouter.post("/calendar", async (req, res) => {
  const { start, end, title, link, notes, quotas, testTechnical } = req.body;
  const citation = new Citation({
    start,
    end,
    title,
    link,
    notes,
    quotas,
    testTechnical,
  });

  await citation.save();
  res.json({
    ok: true,
  });
});

adminRouter.put("/calendar/:id", async (req, res) => {
  const updateEvent = await Citation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200);
  res.json({
    ok: true,
  });
});

adminRouter.delete("/calendar/:id", async (req, res) => {
  await Citation.findByIdAndDelete({ _id: req.params.id });
  res.status(204).json("calednar delete sussces");
});

module.exports = adminRouter;
