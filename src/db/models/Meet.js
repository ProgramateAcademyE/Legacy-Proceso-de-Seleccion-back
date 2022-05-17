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
  interviewersRooms: Number,
  assesmentsRooms: Number,
  rooms: [
    {
      roomID: String, // Lo necesitamos porque la room se puede editar 
      name: String, // Sala + type + number. ej: Sala Assesment 1
      roomType: String, //"ASSESMENT" || "INTERVIEW",
      roomNumber: Number, // Positivo Mayor a 0
      users: [
        {
          userID: String,
          firstName: String,
          lastName: String,
          location: String,
        },
      ],
      selectors: [
        {
          selectorID: String,
          firstName: String,
          lastName: String,
          role: Number // 3||4
        },
      ],
     },
    ],
});

const Meet = model("Meet", MeetSchema);

module.exports = Meet;
