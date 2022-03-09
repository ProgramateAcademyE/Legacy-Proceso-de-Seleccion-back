const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RoomSchema = new Schema(
  {
    citationData: Object,
    interviewers: {type: Array, required: true},
    observers: {type: Array, required: true},
    candidates: {type: Array, required: true},
    room: Array
  }
);

const Room = model('Room', RoomSchema)

module.exports = Room