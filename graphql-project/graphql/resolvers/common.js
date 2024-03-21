
const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");


const transformEvent = (event) => {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: userFunction.bind(this, event._doc.creator),
    };
  };

  let userFunction = async (userId) => {
    try {
      const user = await User.findById(userId);
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: event.bind(this, user._doc.createdEvents),
      };
    } catch (err) {
      throw err;
    }
  };
  
  let eventFunction = async (eventId) => {
    try {
      const singleEvent = await Event.findById(eventId);
      if (!singleEvent) {
        throw new Error(`Event with id: ${eventId} was not found!`);
      }
      return transformEvent(singleEvent);
    } catch (err) {
      throw err;
    }
  };

  let event = async (eventIds) => {
    try {
      const eventList = await Event.find({ _id: { $in: eventIds } });
      return eventList.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: dateToString(event._doc.date),
          creator: userFunction.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      throw err;
    }
  };
  const transformBookings = (booking) => {
    return {
      ...booking._doc,
      _id: booking.id,
      user: userFunction.bind(this, booking._doc.user),
      event: eventFunction.bind(this, booking._doc.event),
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt),
    };
  };
  
  
  exports.userFunction = userFunction;
  exports.transformEvent = transformEvent;
  exports.transformBookings = transformBookings;
  exports.eventFunction = eventFunction;
  exports.event = event;