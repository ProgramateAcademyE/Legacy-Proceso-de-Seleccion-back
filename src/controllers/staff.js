const staffRouter = require('express').Router()
const InterviewDay = require('../db/models/InterviewDay');


// GET INTERVIEW QUESTIONS
// Get the specific questions for a candidate
staffRouter.get('/interview/:id', async (req, res, next) => {
  const candidateInterview = await InterviewDay.find({ 'user_id': req.params.id })
  const { interview } = candidateInterview[0]
  res.json({
          data: interview
  })
})

// GET ASSESMENT QUESTIONS
// Get the specific questions for a candidate
staffRouter.get('/assesment/:id', async (req, res, next) => {
  const candidateAssesment = await InterviewDay.find({ 'user_id': req.params.id })
  const { assesment } = candidateAssesment[0]
  res.json({
          data: assesment
  })
})

// UPDATE INTERVIEW / ASSESMENT SCORES
// Depending of the data received from request updates interview or assesment scores
staffRouter.put('/update-interview', async (req, res) => {
  try {
          const { user_id, interview, assesment } = req.body
          let resultInterview
          let resultAssesment
          // When interview data is received
          if (interview) {
                  const interviewScore = await InterviewDay.updateMany({ 'user_id': user_id }, {
                          $set: {
                                  interview: interview
                          }
                  })
                  const { motivation, perseverance, planning, tecnique } = interview
                  // REFACTORIZAR
                  resultInterview = (motivation.question1.score + motivation.question2.score + perseverance.question1.score + perseverance.question2.score + planning.question1.score + planning.question2.score + tecnique.question1.score + tecnique.question2.score) / 8
                  const score = await InterviewDay.updateMany({ 'user_id': user_id }, {
                          $set: {
                                  interviewScore: resultInterview
                          }
                  })
          }
          // When assesment data is received
          if (assesment) {
                  const assesmentScore = await InterviewDay.updateMany({ 'user_id': user_id }, {
                          $set: {
                                  assesment: assesment
                          }
                  })

                  const { flexibility, comunication, lidership, achievementOrientation } = assesment
                  // REFACTORIZAR
                  resultAssesment = (flexibility.question1.score + flexibility.question2.score + comunication.question1.score + comunication.question2.score + lidership.question1.score + lidership.question2.score + achievementOrientation.question1.score + achievementOrientation.question2.score) / 8
                  const score = await InterviewDay.updateMany({ 'user_id': user_id }, {
                          $set: {
                                  assesmentScore: resultAssesment
                          }
                  })
          }
          const interviewDayScore = (resultInterview + resultAssesment) / 2
          //console.log(interviewDayScore)
          const score = await InterviewDay.updateMany({ 'user_id': user_id }, {
                  $set: {
                          interviewDayScore: interviewDayScore
                  }
          })
          res.send({ data: score })
  } catch {
          res.status(404).send({ error: "Candidate not found" })
  }
})

module.exports = staffRouter
