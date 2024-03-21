const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  createUser: async (args) => {
    try {
      let userObj = await User.findOne({ email: args.user.email });

      if (userObj) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.user.password, 12);

      console.log(JSON.stringify(args));
      const user = new User({
        email: args.user.email,
        password: hashedPassword,
      });
      const result = await user.save();
      console.log(`result fetched: ${JSON.stringify(result)}`);
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error(`User with email: ${email} not found on the database!`);
      }
      const passwordVerification = await bcrypt.compare(
        password,
        user.password
      );
      if (!passwordVerification) {
        throw new Error(`Invalid Credentials`);
      }
      const token = jwt.sign(
        { userId: user.id, email: email },
        "somesupersecretkey",
        {
          expiresIn: "1h",
        }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 };
    } catch (err) {
      throw err;
    }
  },
};
