const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./common");


module.exports = {
  events: async () => {
    let events = await Event.find();
    try {
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args, req) => {
    if(!req.isAuth){
        throw new Error("Unauthenticated!");
    }
    console.log(JSON.stringify(args));
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date(args.event.date),
      creator: "65f82ede6fd2dfaf6c463d6f",
    });
    let createdEvent;
    try {
      let result = await event.save();
      createdEvent = transformEvent(result);
      let userObject = await User.findById("65f82ede6fd2dfaf6c463d6f");

      if (!userObject) {
        throw new Error("User not found");
      }
      userObject.createdEvents.push(event);
      await userObject.save();

      return createdEvent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
