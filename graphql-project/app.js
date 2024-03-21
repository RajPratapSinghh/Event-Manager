const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const { mongoose } = require("mongoose");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(isAuth);

let db = mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ldqgqt5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then()
  .catch((err) => {
    console.error(err);
  });
console.log("Connection established successfuly!");
let events = [];

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);
app.listen(port);
console.log(`code is running on: http://localhost:${port}`);

//Commands:
//mutation {
// createEvent(event: {title: "Swimming", description: "Beat the Heat!", price: 39.99, date: "2024-03-15T07:24:59.882Z"}) {
//     title
//     description
//     price
//   }
// }

// query{
//     events{
//       _id
//       price
//       title
//       description
//       date
//     }
//   }
