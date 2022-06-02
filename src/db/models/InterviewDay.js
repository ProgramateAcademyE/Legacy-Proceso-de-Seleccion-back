const mongoose = require('mongoose');
const { Schema, model } = mongoose;
/*
cuentanos quien eres
de donde eres
que te gusta hacer
con quien vives
*/
const InterviewDaySchema = new Schema({
  meetID: String,
  userID: String,
  names: String,
  surname: String,
  //attendance: Boolean, //Se llena cuando se llama a lista en la reunion default: false
  //qualificationStatus: Boolean, // Indica si la calificaion se realizo con por lo menos 1 entrevistador y un observador
  //icebreakerQuestions: string[], //array de strings // ["¿Cual es tu nombre?", "¿De donde eres?", "¿Que te gusta hacer?"]
  interviewScore: Number, // score final interview => promedio de interview Score
  assesmentScore: Number, // score final assesment => promedio de assesment Score
  interviewDayScore: Number, // score final total => promedio de assesment Score y interview score
  questionaryAssesmentId: String, //array de strings // debe tener 2 questionary ids, uno para el interviewer, uno para el assesment
  questionaryInterviewersId: String,
  interviewers: [
    {
      selectorId: String, // Interviewr _id
      names: String,
      surname: String,
      comment: String,
      score: Number,
      //qualificationStatus: Boolean, // Se actualiza en Enviar Evaluacion => default: false
      qualifications: [
        {
          name: String,
          score: Number, // Entre 1 y 5
        },
      ],
    },
  ],
  observers: [
    {
      selectorId: String, // Observer _id
      names: String,
      surname: String,
      comment: String,
      score: Number,
      //qualificationStatus: Boolean, // Se actualiza en Enviar => default: false
      qualifications: [
        {
          groupID: String,
          name: String,
          score: Number, // Entre 1 y 5
        },
      ],
    },
  ],
});

const InterviewDay = model('InterviewDay', InterviewDaySchema)

module.exports = InterviewDay
