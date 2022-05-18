const mongoose = require("mongoose");

const AvailabilitySchema = new Schema(
    {
      date: Date,
      shift:[], // mañana o tarde o ambas
      selectors: [
        {
          selectorID: string,
          firstName: string,
          lastName: string,
          role: number, // 3||4 || 1,
          availability: [
            {
              shift: string, // mañana o tarde
              meetRole: number, // 3 interviewer || 4 observer
            },
          ],
        },
      ],
    }
  );

  module.exports = mongoose.model("Availability", AvailabilitySchema );