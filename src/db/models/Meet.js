const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MeetSchema = new Schema({
  citationID: String,
  titleConvocatory: String,
  date: Date,
  shift: String,
  link: String,
  usersNumber: Number,
  interviewersNumber: Number,
  observersNumber: Number,
  interviewRooms: Number,
  assesmentsRooms: Number,
  roomsAssesments: [
    {
      roomName: String, // Sala + type + number. ej: Sala Assesment 1
      roomNumber: Number, // Positivo Mayor a 0
      users: [
        {
          _id: String,
          firstName: String,
          lastName: String,
          location: String,
        },
      ],
      selectors: [
        {
          _id: String,
          firstName: String,
          lastName: String,
          meetRole: Number, // 4
        },
      ],
    },
  ],
  roomsInterviewers: [
    {
      roomName: String, // Sala + type + number. ej: Sala Assesment 1
      roomNumber: Number, // Positivo Mayor a 0
      users: [
        {
          _id: String,
          firstName: String,
          lastName: String,
          location: String,
        },
      ],
      selectors: [
        {
          _id: String,
          firstName: String,
          lastName: String,
          meetRole: Number, // 3
        },
      ],
    },
  ],
});

const Meet = model("Meet", MeetSchema);

module.exports = Meet;
