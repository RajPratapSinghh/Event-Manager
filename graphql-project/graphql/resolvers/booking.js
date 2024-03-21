const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { dateToString } = require("../../helpers/date");
const { userFunction, eventFunction, transformEvent, transformBookings } = require("./common");



module.exports = {
  bookings: async (args, req) => {
    if(!req.isAuth){
        throw new Error("Unauthenticated!");
    }
    const bookingDetails = await Booking.find();
    return bookingDetails.map((booking) => {
      return transformBookings(booking);
    });
  },
  bookEvent: async (args, req) => {
    if(!req.isAuth){
        throw new Error("Unauthenticated!");
    }
    try {
      let fetchedEvent = await Event.findOne({ _id: args.eventId });
      if (!fetchedEvent) {
        throw new Error(`Event not found`);
      }
      const booking = new Booking({
        event: fetchedEvent,
        user: req.userId,
      });
      let result = await booking.save();
      return {
        ...result._doc,
        _id: result.id,
        user: userFunction.bind(this, req.userId),
        event: eventFunction.bind(this, args.eventId),
        createdAt: dateToString(result._doc.createdAt),
        updatedAt: dateToString(result._doc.updatedAt),
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if(!req.isAuth){
        throw new Error("Unauthenticated!");
    }
    try {
      let bookingDetails = await Booking.findById(args.bookingId).populate(
        "event"
      );
      console.log(bookingDetails);
      const event = transformEvent(bookingDetails.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
