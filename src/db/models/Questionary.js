const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const QuestionarySchema = new Schema({
  name: String,
  description: String, // E.j: Estas preguntas estan diseñadas la convocatoria programate school
  selectorType: Number, //"3 interviewer" || "4 assesment"
  groups: [
    {
      name: String,
      questions: [{ mainQuestion: String, subQuestions: [] }], // Opcional: Existira solo si el selectorType === "interviewer"
      qualificationOptions: [
        {
          value: Number,
          description: String,
        },
      ],
    },
  ],
});

const Questionary = model("Questionary", QuestionarySchema);

module.exports = Questionary;
