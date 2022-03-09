const mongoose = require('mongoose');
const { Schema, model } = mongoose;
/*
cuentanos quien eres
de donde eres
que te gusta hacer
con quien vives
*/
const InterviewDaySchema = new Schema(
  {
    user_id: String,
    whoYouAreQuestion: String,
    whereYouFromQuestion: String,
    whatDoYouLike: String,
    liveWithQuestion: String,
    interviewComment: String,
    assesmentComment: String,
    interviewScore: Number,
    assesmentScore: Number,
    interviewDayScore: Number,
    interview: {
      motivation: {
        question1: {
          title: String,
          score: Number
        },
        question2: {
          title: String,
          score: Number
        }
      },
      perseverance: {
        question1: {
          title: String,
          score: Number
        },
        question2: {
          title: String,
          score: Number,
        }
      },
      planning: {
        question1: {
          title: String,
          score: Number,
        },
        question2: {
          title: String,
          score: Number,
        }
      },
      tecnique: {
        question1: {
          title: String,
          score: Number,
        },
        question2: {
          title: String,
          score: Number,
        }
      }
    },
    assesment: {
      flexibility: {
        question1: {
          title: String,
          score: Number,
        }
      },
      comunication: {
        question1: {
          title: String,
          score: Number,
        }
      },
      lidership: {
        question1: {
          title: String,
          score: Number,
        }
      },
      achievementOrientation: {
        question1: {
          title: String,
          score: Number,
        }
      }
    },
  }
);

const InterviewDay = model('InterviewDay', InterviewDaySchema)

module.exports = InterviewDay
